output "bastion_ip" {
  value = aws_instance.bastion.public_ip
}

output "elastic_ip" {
  description = "main ip for accessibility-demo"
  value = aws_eip.argocd_eip.address
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

output "elasticsearch_endpoint" {
  description = "Room8 Elasticsearch endpoint"
  value       = aws_opensearch_domain.room8_elasticsearch.endpoint
}


