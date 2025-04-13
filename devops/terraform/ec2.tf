resource "aws_instance" "bastion" {
  ami           = var.ami # Ubuntu 2025, update if needed
  instance_type = "t3.xlarge"
  subnet_id     = aws_subnet.public[0].id
  key_name      = var.key_name  # Replace with your key pair
  associate_public_ip_address = true
  vpc_security_group_ids = [aws_security_group.bastion_sg.id]

  user_data = file("scripts/k8s-bootstrap.sh")

  tags = { Name = "room8-bastion" }
}
