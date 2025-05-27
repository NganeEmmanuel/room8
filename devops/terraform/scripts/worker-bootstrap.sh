#!/bin/bash
set -e

echo "🚀 Starting Kubernetes worker bootstrap script..."
sleep 60  # Wait to ensure network stability before internet-based installs

# ----------------------------
# 0. Install AWS CLI
# ----------------------------

echo "🛠️ Installing AWS CLI..."
apt-get update -y
apt-get install -y awscli

# Set region for AWS CLI (optional if region is already picked up via instance metadata)
export AWS_DEFAULT_REGION=us-east-1  # Change this if you're in another region

# ----------------------------
# 1. System Preparation
# ----------------------------

echo "📦 Updating system packages..."
apt-get upgrade -y

echo "📚 Installing dependencies..."
apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release software-properties-common git

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

# (Optional) Allow docker use without sudo for user 'ubuntu'
# usermod -aG docker ubuntu

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

# ----------------------------
# 6. Install Kubernetes Tools
# ----------------------------

echo "📦 Installing Kubernetes tools..."
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.32/deb/Release.key | gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.32/deb/ /" | tee /etc/apt/sources.list.d/kubernetes.list

apt-get update -y
apt-get install -y kubelet kubeadm kubectl
apt-mark hold kubelet kubeadm kubectl

echo "⚙️ Configuring Kubelet..."
KUBELET_DEFAULT_FILE="/etc/default/kubelet"
KUBELET_LINE='KUBELET_EXTRA_ARGS="--cgroup-driver=cgroupfs"'

sed -i '/^KUBELET_EXTRA_ARGS=/d' "$KUBELET_DEFAULT_FILE"
echo "$KUBELET_LINE" > "$KUBELET_DEFAULT_FILE"

systemctl daemon-reload
systemctl enable kubelet
systemctl restart kubelet

# ----------------------------
# 7. Docker Daemon Configuration
# ----------------------------

echo "⚙️ Configuring Docker daemon..."
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
echo "✅ Docker daemon ready."


# ----------------------------
# 8. Set Unique Hostname for Worker
# ----------------------------

echo "🖥️ Setting unique hostname for this worker node..."

# Retrieve the EC2 Instance ID from metadata
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)

# Set the hostname to the instance ID (you can modify this to suit your naming convention)
hostnamectl set-hostname "worker-${INSTANCE_ID}"

# Update /etc/hosts to reflect the new hostname
sed -i "s/127.0.0.1.*localhost/127.0.0.1 ${INSTANCE_ID}/g" /etc/hosts


# ----------------------------
# 9. Download and Run Join Script
# ----------------------------

echo "⬇️ Downloading join.sh from S3..."

# ✅ UPDATE THIS TO YOUR ACTUAL BUCKET NAME
BUCKET_NAME="room8-bootstrap-join-bucket"

aws s3 cp s3://$BUCKET_NAME/join.sh /opt/join.sh
chmod +x /opt/join.sh

echo "🔗 Running kubeadm join script..."
bash /opt/join.sh

echo "✅ Join command executed successfully. This worker is now part of the cluster."
