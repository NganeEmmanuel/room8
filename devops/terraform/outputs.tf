output "bastion_ip" {
  value = aws_instance.bastion.public_ip
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}
