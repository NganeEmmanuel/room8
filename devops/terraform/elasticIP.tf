resource "aws_eip" "argocd_eip" {
  domain = "vpc"
  tags = {
    Name = "ingress-nginx-lb-eip"
  }
}

resource "aws_eip_association" "argocd_eip_assoc" {
  instance_id   = aws_instance.bastion.id
  allocation_id = aws_eip.argocd_eip.id
}
