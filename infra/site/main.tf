terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # This project's notebook: same bucket, different file
  backend "s3" {
    bucket       = "wvrner-tfstate-370819018992"
    key          = "site/terraform.tfstate"
    region       = "eu-central-1"
    use_lockfile = true
    encrypt      = true
  }
}

provider "aws" {
  region = "eu-central-1"
}

# The bucket that will hold your website's files
resource "aws_s3_bucket" "site" {
  bucket = "wvrner-site-370819018992"
}

# Keep it private: visitors never reach the bucket directly, only through CloudFront
resource "aws_s3_bucket_public_access_block" "site" {
  bucket = aws_s3_bucket.site.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
# A second connection to AWS, pointed at Virginia (needed for CloudFront certificates)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

# Ask AWS for a free HTTPS certificate for the test address
resource "aws_acm_certificate" "site" {
  provider          = aws.us_east_1
  domain_name       = "aws.wvrner.com"
  validation_method = "DNS"
}

# Show the DNS record AWS wants us to add (to prove we own the domain)
output "cert_validation_record" {
  value = aws_acm_certificate.site.domain_validation_options
}