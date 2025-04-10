#!/bin/bash

# Update system packages
apt-get update -y
apt-get upgrade -y

# Install required dependencies
apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release software-properties-common git

# Install Docker (from Docker's official repo)
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/trusted.gpg.d/docker.gpg

add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) stable"

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io

# Enable Docker
systemctl enable docker
systemctl start docker

# Allow current user to run docker without sudo (optional)
usermod -aG docker ubuntu

# Disable swap (K8s requires swap to be off)
swapoff -a
sed -i '/ swap / s/^/#/' /etc/fstab

# Add Kubernetes repo
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -

cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF

# Install kubelet, kubeadm, kubectl
apt-get update -y
apt-get install -y kubelet kubeadm kubectl

# Hold them at current version (optional but recommended)
apt-mark hold kubelet kubeadm kubectl

# Enable and start kubelet
systemctl enable kubelet
systemctl start kubelet
