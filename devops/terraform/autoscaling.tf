resource "aws_launch_template" "app_node" {
  name_prefix   = "room8-app-node"
  image_id      = var.ami
  instance_type = var.instance_type
  key_name      = var.key_name
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  user_data = base64encode(file("scripts/k8s-bootstrap.sh"))  # Optional

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
