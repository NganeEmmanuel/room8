#!/bin/bash

set -e  # Exit immediately on error


echo "🔧 Starting Kubernetes bootstrap script..."

# ----------------------------
# 1. System Preparation
# ----------------------------

echo "📦 Updating system packages..."
apt-get update -y
apt-get upgrade -y

# Install required system dependencies
echo "📚 Installing dependencies..."

apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release software-properties-common git unzip


# ----------------------------
# 2. Kernel Parameters for Kubernetes
# ----------------------------


echo "🔧 Loading kernel modules..."
modprobe overlay
modprobe br_netfilter

echo -e "overlay\nbr_netfilter" | tee /etc/modules-load.d/k8s.conf

echo "🔧 Setting sysctl parameters..."
cat <<EOF | tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
sysctl --system


# ----------------------------
# 3. Disable Swap
# ----------------------------

echo "🚫 Disabling swap..."

swapoff -a
sed -i '/ swap / s/^/#/' /etc/fstab


# ----------------------------
# 4. Install Docker
# ----------------------------

echo "🐳 Installing Docker..."
apt-get install -y docker.io


systemctl enable docker
systemctl start docker

usermod -aG docker ubuntu

# ----------------------------
# 5. Install containerd
# ----------------------------

echo "📦 Installing containerd..."
apt-get install -y containerd

echo "⚙️ Configuring containerd..."
mkdir -p /etc/containerd
containerd config default | tee /etc/containerd/config.toml

sed -i '/\[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options\]/,/^\[/{s/SystemdCgroup = false/SystemdCgroup = true/}' /etc/containerd/config.toml

systemctl enable containerd
systemctl start containerd
echo "✅ containerd configured with SystemdCgroup = true"

# ----------------------------
# 6. Kubernetes Repo & Install
# ----------------------------

echo "📦 Installing Kubernetes tools..."
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.32/deb/Release.key | gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.32/deb/ /" | tee /etc/apt/sources.list.d/kubernetes.list


apt-get update -y
apt-get install -y kubelet kubeadm kubectl
apt-mark hold kubelet kubeadm kubectl


echo "⚙️ Configuring Kubelet cgroup driver..."
KUBELET_DEFAULT_FILE="/etc/default/kubelet"
KUBELET_LINE='KUBELET_EXTRA_ARGS="--cgroup-driver=cgroupfs"'

sed -i '/^KUBELET_EXTRA_ARGS=/d' "$KUBELET_DEFAULT_FILE" || true
echo "$KUBELET_LINE" | tee "$KUBELET_DEFAULT_FILE" > /dev/null

systemctl daemon-reload
systemctl enable kubelet
systemctl restart kubelet

# ----------------------------
# 7. Docker Daemon Configuration
# ----------------------------

echo "⚙️ Modifying Docker Daemon configuration..."
mkdir -p /etc/docker

tee /etc/docker/daemon.json > /dev/null << 'EOF'

{
    "exec-opts": ["native.cgroupdriver=systemd"],
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "100m"
    },
    "storage-driver": "overlay2"
}
EOF


systemctl daemon-reload
systemctl restart docker

echo "⏳ Waiting for Docker service to be active..."
until systemctl is-active --quiet docker; do
    echo "🔁 Waiting for Docker to be active..."
    sleep 2
done
echo "✅ Docker is active."

# ----------------------------


# 8. Install AWS CLI
# ----------------------------

echo "📦 Installing AWS CLI v2..."
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install

aws --version
echo "✅ AWS CLI installed successfully."

# Cleanup AWS CLI install files
rm -rf aws awscliv2.zip

# ----------------------------
# 9. Kubernetes Initialization
# ----------------------------

echo "🚀 Initializing Kubernetes cluster..."

set +e
kubeadm init --control-plane-endpoint="$HOST_IP" --pod-network-cidr=192.168.0.0/16 --upload-certs
INIT_STATUS=$?
set -e


if [ $INIT_STATUS -ne 0 ]; then
    echo "🔁 Retrying kubeadm init..."

    sleep 10
    kubeadm reset -f
    systemctl restart kubelet
    kubeadm init --control-plane-endpoint="$HOST_IP" --pod-network-cidr=192.168.0.0/16 --upload-certs

fi

# ----------------------------
# 10. Setup kubeconfig

# ----------------------------

echo "📁 Setting up kubeconfig for ubuntu user..."
mkdir -p /home/ubuntu/.kube

cp /etc/kubernetes/admin.conf /home/ubuntu/.kube/config
chown ubuntu:ubuntu /home/ubuntu/.kube/config

# ----------------------------
# 11. Install CNI Plugin (Calico)
# ----------------------------

echo "🌐 Installing Calico CNI plugin..."

echo "⏳ Waiting for Kubernetes API server to be ready..."
timeout=100
elapsed=0
interval=5


while (( elapsed < timeout )); do
    if su - ubuntu -c "kubectl get nodes" &>/dev/null; then
        echo "✅ API server is ready."
        break
    fi
    echo "🔁 Waiting for API server..."

    sleep $interval
    elapsed=$((elapsed + interval))
done

if (( elapsed >= timeout )); then
    echo "❌ Timeout reached waiting for API server."
fi

su - ubuntu -c "kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.0/manifests/calico.yaml"
echo "✅ Calico CNI plugin installed."

# ----------------------------
# 12. Save Join Command
# ----------------------------

echo "📁 Generating join command..."
kubeadm token create --print-join-command > /opt/join.sh
chmod +x /opt/join.sh

echo "☁️ Uploading join.sh to S3..."
aws s3 cp /opt/join.sh s3://room8-bootstrap-join-bucket/join.sh

if [ $? -eq 0 ]; then
    echo "✅ Join script successfully uploaded to S3."
else
    echo "❌ Failed to upload join script to S3."
fi

echo "✅ Kubernetes cluster bootstrapped successfully!"

