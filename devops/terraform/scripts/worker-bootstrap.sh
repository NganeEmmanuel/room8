#!/bin/bash
set -e

echo "🚀 Starting Kubernetes worker bootstrap script..."
sleep 120  # Wait 1 minute before running internet-dependent commands


# ----------------------------
# 1. System Preparation
# ----------------------------

echo "📦 Updating system packages..."
apt-get update -y
apt-get upgrade -y

# Install required system dependencies
echo "📚 Installing dependencies..."
apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release software-properties-common git

# ----------------------------
# 2. Kernel Parameters for Kubernetes
# ----------------------------

# Load necessary kernel modules
echo "🔧 Loading kernel modules..."
sudo modprobe overlay
sudo modprobe br_netfilter

# Ensure modules are loaded at boot
echo -e "overlay\nbr_netfilter" | sudo tee /etc/modules-load.d/k8s.conf

# Set system configurations for Kubernetes networking
echo "🔧 Setting sysctl parameters..."
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
sudo sysctl --system

# ----------------------------
# 3. Disable Swap
# ----------------------------

echo "🚫 Disabling swap..."
sudo swapoff -a
sudo sed -i '/ swap / s/^/#/' /etc/fstab

# ----------------------------
# 4. Install Docker
# ----------------------------

echo "🐳 Installing Docker..."
apt-get install -y docker.io

# Enable and start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Add ubuntu user to the docker group
sudo usermod -aG docker ubuntu # todo potential remove

# ----------------------------
# 4. Install containerd
# ----------------------------
echo "📦 Installing containerd..."
apt-get install -y containerd

# Configure containerd
echo "⚙️ Configuring containerd..."
# Create default configuration file for containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml

# Update the config file to set SystemdCgroup to true
sudo sed -i '/\[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options\]/,/^\[/{s/SystemdCgroup = false/SystemdCgroup = true/}' /etc/containerd/config.toml

# Restart containerd to apply changes
sudo systemctl enable containerd
sudo systemctl start containerd
echo "Updated /etc/containerd/config.toml to set SystemdCgroup = true"

# ----------------------------
# 5. Kubernetes Repo & Install
# ----------------------------

echo "📦 Installing Kubernetes tools (kubelet, kubeadm, kubectl)..."
# Add Kubernetes repo and GPG key
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.32/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.32/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list

# Install Kubernetes core binaries
apt-get update -y
apt-get install -y kubelet kubeadm kubectl
apt-mark hold kubelet kubeadm kubectl

# Modify Kubelet Configuration
echo "⚙️ Modifying Kubelet configuration"
# Ensure only one line exists with the correct value
KUBELET_DEFAULT_FILE="/etc/default/kubelet"
KUBELET_LINE='KUBELET_EXTRA_ARGS="--cgroup-driver=cgroupfs"'

if [ -f "$KUBELET_DEFAULT_FILE" ]; then
    # Remove all existing lines with KUBELET_EXTRA_ARGS
    sudo sed -i '/^KUBELET_EXTRA_ARGS=/d' "$KUBELET_DEFAULT_FILE"
fi

# Add the correct line
echo "$KUBELET_LINE" | sudo tee "$KUBELET_DEFAULT_FILE" > /dev/null

echo "✅ /etc/default/kubelet set to: $KUBELET_LINE"

# Enable kubelet service
sudo systemctl daemon-reload  # Reload system daemon
sudo systemctl enable kubelet
sudo systemctl restart kubelet

# ----------------------------
# 6. Docker Daemon Configuration
# ----------------------------

echo "⚙️ Modifying Docker Daemon Configuration"

sudo mkdir -p /etc/docker

# Create or overwrite the daemon.json file
sudo tee /etc/docker/daemon.json > /dev/null << 'EOF'
{
    "exec-opts": ["native.cgroupdriver=systemd"],
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "100m"
    },
    "storage-driver": "overlay2"
}
EOF

echo "✅ Docker daemon configuration updated."

systemctl daemon-reload
systemctl restart docker
echo "✅ Docker daemon ready."

echo "✅ Worker node is ready to join the cluster."
echo "ℹ️ Use the kubeadm join command from the control plane (master) to join this worker node."
