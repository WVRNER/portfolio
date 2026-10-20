variable "region" {
  description = "Main AWS region for the website"
  type        = string
  default     = "eu-central-1"
}

variable "domain" {
  description = "The address the website answers on"
  type        = string
  default     = "aws.wvrner.com"
}