terraform {
  backend "s3" {
    bucket         = "room8-tf-state-lock-bucket"   # CHANGE THIS
    key            = "devops/terraform.tfstate"
    region         = "eu-north-1"

    # use_lockfile   = "terraform-locks"

    dynamodb_table = "terraform-locks"         # Optional, for state locking
    encrypt        = true
  }
}
