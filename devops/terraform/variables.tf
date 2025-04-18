variable "aws_region" {
  description = "The region for the provider"
  default = "eu-north-1"
}

variable "availability_zones" {
  description = "The list of availability zones for the selected region"
  default = ["eu-north-1a", "eu-north-1b"]
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC. Default value is a valid CIDR"
  default = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "The CIDR block for the public subnet."
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "The CIDR block for the private subnet."
  default = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "instance_type" {
  description = "AWS instance type"
  default = "t3.xlarge"  # ⚠️ For heavy apps, can go higher (e.g., t3.xlarge)
}

variable "team_ip_address" {
  description = "Ip address of my device"
}

variable "ami" {
  description = "value for ami type you want to use"
}

variable "key_name" {
  description = "SSH key pair name"
}

variable "private_key_path" {
  description = "SSH private key path"
}
