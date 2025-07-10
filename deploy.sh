#!/bin/bash

# Deploy script for bswdegree.org website to S3 bucket
# Created: 2025-07-09

# Exit on error
set -e

# Configuration
S3_BUCKET="bswdegree.org"
AWS_PROFILE="learntechstack"

echo "Starting deployment to S3 bucket: $S3_BUCKET"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if the specified profile exists
if ! aws configure list --profile $AWS_PROFILE &> /dev/null; then
    echo "Error: AWS profile '$AWS_PROFILE' not found. Please check your AWS credentials."
    exit 1
fi

# Deploy to S3
echo "Syncing files to S3 bucket..."
aws s3 sync . s3://$S3_BUCKET/ \
    --profile $AWS_PROFILE \
    --exclude ".git/*" \
    --exclude "*.sh" \
    --exclude "README.md" \
    --exclude ".gitignore" \
    --exclude "node_modules/*" \
    --exclude "cloudformation/*" \
    --exclude ".claude/*" \
    --exclude "CLAUDE.md" \
    --delete

# Invalidate CloudFront cache
CLOUDFRONT_DISTRIBUTION_ID="E1DPKTG96SLOP7"
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
    --paths "/*" \
    --profile $AWS_PROFILE

echo "Deployment completed successfully!"
