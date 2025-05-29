# redis.tf

resource "aws_elasticache_subnet_group" "room8_redis_subnet_group" {
  name       = "room8-redis-subnet-group"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_elasticache_cluster" "room8_redis" {
  cluster_id           = "room8-redis"
  engine               = "redis"
  node_type            = "cache.t2.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis6.x"
  subnet_group_name    = aws_elasticache_subnet_group.room8_redis_subnet_group.name
  security_group_ids   = [aws_security_group.redis_sg.id]
}
