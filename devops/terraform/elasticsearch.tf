resource "aws_opensearch_domain" "room8_elasticsearch" {
  domain_name           = "room8-elasticsearch"
  engine_version        = "OpenSearch_2.11"

  cluster_config {
    instance_type  = "t3.small.search"
    instance_count = 1
    zone_awareness_enabled = false
  }

  ebs_options {
    ebs_enabled = true
    volume_size = 20
    volume_type = "gp2"
  }

  access_policies = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "es:*"
        Resource  = "arn:aws:es:${var.aws_region}:${data.aws_caller_identity.current.account_id}:domain/room8-elasticsearch/*"
        Condition = {
          IpAddress = {
            "aws:SourceIp" = var.team_ip_address
          }
        }
      }
    ]
  })

  vpc_options {
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.elasticsearch_sg.id]
  }

  tags = {
    Name = "room8-elasticsearch"
  }
}

data "aws_caller_identity" "current" {}
