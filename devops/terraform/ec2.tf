resource "aws_instance" "bastion" {
  ami                        = var.ami # Ubuntu 2025, update if needed
  instance_type              = "t3.xlarge"
  subnet_id                  = aws_subnet.public[0].id
  key_name                   = var.key_name  # Replace with your key pair
  associate_public_ip_address = true
  vpc_security_group_ids     = [aws_security_group.bastion_sg.id]
  iam_instance_profile = aws_iam_instance_profile.master_profile.name #iam roles for master s3 put {in this case the bastion is our master node}

  # Add 15 GB EBS volume (root volume)
  root_block_device {
    volume_size = 15         # Change this to desired size in GB
    volume_type = "gp3"      # gp3 is cost-effective and fast; or use gp2
    delete_on_termination = true
  }

  # Add the file provisioner to copy the PEM file
  provisioner "file" {
    source      = "aws_login.pem"  # Relative path within your Terraform directory
    destination = "/home/ubuntu/aws_login.pem"  # Linux path for Bastion instance

    connection {
      type        = "ssh"
      host        = self.public_ip
      user        = "ubuntu"
      private_key = file(var.private_key_path)  # Path to the private key, use a variable if needed
    }
  }

  # Add the remote-exec provisioner to set the permissions on the PEM file
  provisioner "remote-exec" {
    inline = [
      "chmod 400 /home/ubuntu/aws_login.pem"
    ]

    connection {
      type        = "ssh"
      host        = self.public_ip
      user        = "ubuntu"
      private_key = file(var.private_key_path)  # Path to the private key, use a variable if needed
    }
  }

  user_data = file("scripts/k8s-bootstrap.sh")

  tags = {
    Name = "k8s-bastion-master"
    Role = "master"
  }
}
