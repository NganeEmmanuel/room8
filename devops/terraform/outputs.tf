output "bastion_ip" {
  value = aws_instance.bastion.public_ip
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}

output "rds_endpoint" {
  value = aws_db_instance.room8_mysql.endpoint
}

output "redis_endpoint" {
  value = aws_elasticache_cluster.room8_redis.cache_nodes[0].address
}

