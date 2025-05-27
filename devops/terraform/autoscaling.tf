resource "aws_launch_template" "app_node" {
  name_prefix   = "room8-app-node"
  image_id      = var.ami
  instance_type = var.instance_type
  key_name      = var.key_name
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  iam_instance_profile {
    name = aws_iam_instance_profile.worker_profile.name # iam role for worker
  }

  # Set root volume size and type
  block_device_mappings {
    device_name = "/dev/sda1"  # ✅ Root device
    ebs {
      volume_size           = 20         # ✅ Increase to 20 GB
      volume_type           = "gp3"
      delete_on_termination = true
    }
  }

  user_data = base64encode(file("scripts/worker-bootstrap.sh"))  # for bootstrap script
}

resource "aws_autoscaling_group" "app_nodes" {
  desired_capacity     = 2
  max_size             = 4
  min_size             = 2
  vpc_zone_identifier  = aws_subnet.private[*].id
  launch_template {
    id      = aws_launch_template.app_node.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "room8-app-node"
    propagate_at_launch = true
  }
}
