variable "aws_region" {
  description = "AWS deployment region"
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Custom root domain name for portfolio"
  type        = string
  default     = "wvrner.com"
}

variable "environment" {
  description = "Target environment tier"
  type        = string
  default     = "production"
}

variable "bucket_name" {
  description = "Unique S3 bucket name for static assets"
  type        = string
  default     = "wvrner-portfolio-static"
}
