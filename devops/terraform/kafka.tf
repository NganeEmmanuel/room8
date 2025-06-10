resource "aws_msk_cluster" "room8_kafka" {
  cluster_name           = "room8-kafka"
  kafka_version          = "3.6.0" # Latest supported version as of now
  number_of_broker_nodes = 2

  broker_node_group_info {
    instance_type   = "kafka.t3.small"
    ebs_volume_size = 20
    client_subnets  = aws_subnet.private[*].id
    security_groups = [aws_security_group.kafka_sg.id]
  }

  encryption_info {
    encryption_in_transit {
      client_broker = "PLAINTEXT"
      in_cluster    = true
    }
  }

  logging_info {
    broker_logs {
      cloudwatch_logs {
        enabled = true
        log_group = aws_cloudwatch_log_group.kafka_logs.name
      }
    }
  }

  tags = {
    Name = "room8-kafka"
  }
}

resource "aws_cloudwatch_log_group" "kafka_logs" {
  name              = "/aws/msk/room8-kafka"
  retention_in_days = 7
}
