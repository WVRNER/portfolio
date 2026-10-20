terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # This project's notebook: same bucket, different file
  # (the backend can't use variables, so the values stay typed out here)
  backend "s3" {
    bucket       = "wvrner-tfstate-370819018992"
    key          = "site/terraform.tfstate"
    region       = "eu-central-1"
    use_lockfile = true
    encrypt      = true
  }
}

provider "aws" {
  region = var.region # <- CHANGED (no quotes)
}

# The bucket that will hold your website's files
resource "aws_s3_bucket" "site" {
  bucket = local.site_bucket
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
  domain_name       = var.domain # <- CHANGED (no quotes)
  validation_method = "DNS"
}

# Show the DNS record AWS wants us to add (to prove we own the domain)
output "cert_validation_record" {
  value = aws_acm_certificate.site.domain_validation_options
}

# Wait until the certificate is "Issued" before anything uses it
resource "aws_acm_certificate_validation" "site" {
  provider        = aws.us_east_1
  certificate_arn = aws_acm_certificate.site.arn
}

# CloudFront's "staff badge" for reading the private bucket
resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "wvrner-site-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Look up AWS's ready-made "cache efficiently" settings
data "aws_cloudfront_cache_policy" "optimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  aliases             = [var.domain] # <- CHANGED (brackets stay, quotes go)
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  # WHERE to fetch files from: your private bucket, using the badge
  origin {
    origin_id                = "s3-site"
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  # HOW to handle visitors
  default_cache_behavior {
    target_origin_id       = "s3-site"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = data.aws_cloudfront_cache_policy.optimized.id
    compress               = true
  }

  # No country blocking
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # The padlock
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.site.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

# The rule: "CloudFront may read files, but only THIS distribution"
data "aws_iam_policy_document" "site" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }
}

# Stick that rule on the bucket's door
resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = data.aws_iam_policy_document.site.json
}

# Print CloudFront's own address so we can test it
output "cloudfront_domain" {
  value = aws_cloudfront_distribution.site.domain_name
}
data "aws_caller_identity" "me" {
}
locals {
  site_bucket = "wvrner-site-${data.aws_caller_identity.me.account_id}"
}