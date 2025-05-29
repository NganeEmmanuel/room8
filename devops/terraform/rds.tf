# rds.tf

resource "aws_db_subnet_group" "room8_rds_subnet_group" {
  name       = "room8-rds-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "room8-rds-subnet-group"
  }
}

resource "aws_db_instance" "room8_mysql" {
  identifier              = "room8-mysql-db"
  engine                  = "mysql"
  engine_version          = "8.0"
  instance_class          = "db.t3.micro"
  allocated_storage       = 20
  storage_type            = "gp2"
  username                = var.db_username
  password                = var.db_password
  db_name                 = "room8db"
  publicly_accessible     = false
  multi_az                = false
  vpc_security_group_ids  = [aws_security_group.db_sg.id]
  db_subnet_group_name    = aws_db_subnet_group.room8_rds_subnet_group.name
  skip_final_snapshot     = true

  tags = {
    Name = "room8-mysql"
  }
}
