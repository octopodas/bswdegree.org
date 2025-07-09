#!/bin/bash

# Infrastructure management script for bswdegree.org
# Created: 2025-07-09
# This script manages the S3 bucket and CloudFront distribution via CloudFormation

# Exit on error
set -e

# Configuration
STACK_NAME="bswdegree.org"
TEMPLATE_FILE="./cloudformation/template.yaml"
AWS_PROFILE="learntechstack"

echo "Starting CloudFormation stack deployment for $STACK_NAME (S3 bucket and CloudFront distribution)"

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

# Check if template file exists
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "Error: CloudFormation template file not found at $TEMPLATE_FILE"
    exit 1
fi

# Create imports file for existing CloudFront distribution
CLOUDFRONT_DIST_ID="E1DPKTG96SLOP7"
IMPORTS_FILE="./cloudformation/imports.json"

cat > $IMPORTS_FILE << EOF
[
  {
    "ResourceType": "AWS::CloudFront::Distribution",
    "LogicalResourceId": "WebsiteDistribution",
    "ResourceIdentifier": {
      "Id": "$CLOUDFRONT_DIST_ID"
    }
  }
]
EOF

# Check if the stack exists
if aws cloudformation describe-stacks --stack-name $STACK_NAME --profile $AWS_PROFILE &> /dev/null; then
    echo "Stack $STACK_NAME exists. Updating..."
    # Update existing stack
    aws cloudformation update-stack \
        --stack-name $STACK_NAME \
        --template-body file://$TEMPLATE_FILE \
        --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
        --resource-types "AWS::S3::Bucket" "AWS::S3::BucketPolicy" "AWS::CloudFront::CloudFrontOriginAccessIdentity" "AWS::CloudFront::Distribution" \
        --profile $AWS_PROFILE
        
    echo "Waiting for stack update to complete..."
    aws cloudformation wait stack-update-complete \
        --stack-name $STACK_NAME \
        --profile $AWS_PROFILE
    
    echo "Stack updated successfully! S3 bucket and CloudFront distribution have been updated."
else
    echo "Stack $STACK_NAME does not exist. Creating..."
    # Create new stack with resource import
    aws cloudformation create-change-set \
        --stack-name $STACK_NAME \
        --change-set-name ImportChangeSet \
        --change-set-type IMPORT \
        --template-body file://$TEMPLATE_FILE \
        --resources-to-import file://$IMPORTS_FILE \
        --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
        --profile $AWS_PROFILE
        
    echo "Waiting for import change set creation..."
    aws cloudformation wait change-set-create-complete \
        --stack-name $STACK_NAME \
        --change-set-name ImportChangeSet \
        --profile $AWS_PROFILE
        
    echo "Executing import change set..."
    aws cloudformation execute-change-set \
        --stack-name $STACK_NAME \
        --change-set-name ImportChangeSet \
        --profile $AWS_PROFILE
    
    echo "Waiting for stack creation to complete..."
    aws cloudformation wait stack-create-complete \
        --stack-name $STACK_NAME \
        --profile $AWS_PROFILE
    
    echo "Stack created successfully! S3 bucket has been configured and CloudFront distribution has been imported."
fi

# Display stack outputs
echo -e "\nStack outputs:"
aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query "Stacks[0].Outputs" \
    --output table \
    --profile $AWS_PROFILE

echo -e "\nInfrastructure management completed!"

echo -e "\nReminder: To deploy your website content, run:"
echo "./deploy.sh"

echo -e "\nNote: The first deployment might fail if the CloudFront import is still in progress.
If that happens, wait a few minutes and try again."
