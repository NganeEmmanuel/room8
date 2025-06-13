
# IAM ROLE  CREATION
# <------start of master role creation---------------------->
# Creating the role for master instances
resource "aws_iam_role" "master_s3_upload_role" {
  name = "room8-master-s3-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "ec2.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

# creating policy for master instance for s3 put object
resource "aws_iam_policy" "master_s3_policy" {
  name = "room8-master-s3-upload-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Action = [
        "s3:PutObject"
      ],
      Resource = "arn:aws:s3:::room8-bootstrap-join-bucket/*"
    }]
  })
}

# Attaching the master policy (s3 put object) to the master role for master  instances
resource "aws_iam_role_policy_attachment" "attach_master_policy" {
  role       = aws_iam_role.master_s3_upload_role.name
  policy_arn = aws_iam_policy.master_s3_policy.arn
}

# Creating the master instance profile to attache to the instance containing the role
resource "aws_iam_instance_profile" "master_profile" {
  name = "room8-master-instance-profile"
  role = aws_iam_role.master_s3_upload_role.name
}

# <------End of master role creation---------------------->


# <------Start of worker role creation---------------------->
# Creating the role for worker instances
resource "aws_iam_role" "worker_s3_download_role" {
  name = "room8-worker-s3-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "ec2.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

# creating policy for worker instance for s3 put object
resource "aws_iam_policy" "worker_s3_policy" {
  name = "room8-worker-s3-download-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Action = [
        "s3:GetObject"
      ],
      Resource = "arn:aws:s3:::room8-bootstrap-join-bucket/*"
    }]
  })
}

# Attaching the worker policy (s3 get object) to the worker role for master
resource "aws_iam_role_policy_attachment" "attach_worker_policy" {
  role       = aws_iam_role.worker_s3_download_role.name
  policy_arn = aws_iam_policy.worker_s3_policy.arn
}

# Creating the worker instance profile to attache to the launch template containing the role
resource "aws_iam_instance_profile" "worker_profile" {
  name = "room8-worker-instance-profile"
  role = aws_iam_role.worker_s3_download_role.name
}
#
# # creating opensearch role for elastic search
# resource "aws_iam_policy" "opensearch_access_policy" {
#   name = "room8-opensearch-access-policy"
#   policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Effect = "Allow",
#         Action = [
#           "es:ESHttpGet",
#           "es:ESHttpPost",
#           "es:ESHttpPut",
#           "es:ESHttpDelete",
#           "es:DescribeDomain",
#           "es:DescribeElasticsearchDomain", # needed for older API compatibility
#           "es:ListDomainNames"              # optional but useful
#         ],
#         Resource = "arn:aws:es:${var.aws_region}:${data.aws_caller_identity.current.account_id}:domain/room8-elasticsearch/*"
#       }
#     ]
#   })
# }
#
# resource "aws_iam_role_policy_attachment" "attach_master_opensearch_policy" {
#   role       = aws_iam_role.master_s3_upload_role.name
#   policy_arn = aws_iam_policy.opensearch_access_policy.arn
# }
#
# resource "aws_iam_role_policy_attachment" "attach_worker_opensearch_policy" {
#   role       = aws_iam_role.worker_s3_download_role.name
#   policy_arn = aws_iam_policy.opensearch_access_policy.arn
# }


# <------End of worker role creation---------------------->