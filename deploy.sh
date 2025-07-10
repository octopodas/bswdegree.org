#!/bin/bash

# Deploy script for bswdegree.org website to S3 bucket
# Updated: 2025-07-10 - Added Astro build process

# Exit on error
set -e

# Configuration
S3_BUCKET="bswdegree.org"
AWS_PROFILE="learntechstack"

echo "Starting deployment to S3 bucket: $S3_BUCKET"

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install it first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install it first."
    exit 1
fi

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

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

# Build the Astro site
echo "Building Astro site..."
npm run build

# Deploy to S3
echo "Syncing files to S3 bucket..."
aws s3 sync dist/ s3://$S3_BUCKET/ \
    --profile $AWS_PROFILE \
    --delete

# Invalidate CloudFront cache
CLOUDFRONT_DISTRIBUTION_ID="E1DPKTG96SLOP7"
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
    --paths "/*" \
    --profile $AWS_PROFILE

echo "Deployment completed successfully!"
