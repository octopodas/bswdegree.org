#!/bin/bash

# Infrastructure management script for bswdegree.org
# Created: 2025-07-09
# This script manages the S3 bucket and CloudFront distribution via CloudFormation

# Exit on error
set -e

# Configuration
STACK_NAME="BswDegreeOrg"
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

# Create imports file for the CloudFront distribution
CLOUDFRONT_DIST_ID="E1DPKTG96SLOP7"
BUCKET_NAME="bswdegree.org"
IMPORTS_FILE="./cloudformation/imports.json"

cat > $IMPORTS_FILE << EOF
[
  {
    "ResourceType": "AWS::S3::Bucket",
    "LogicalResourceId": "WebsiteBucket",
    "ResourceIdentifier": {
      "BucketName": "$BUCKET_NAME"
    }
  },
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
        --profile $AWS_PROFILE || true
        
    # Check if there are changes to be updated
    UPDATE_STATUS=$?
    if [ $UPDATE_STATUS -eq 0 ]; then
        echo "Waiting for stack update to complete..."
        aws cloudformation wait stack-update-complete \
            --stack-name $STACK_NAME \
            --profile $AWS_PROFILE
        
        echo "Stack updated successfully! CloudFront configuration has been updated."
    else
        echo "No updates are to be performed."
    fi
else
    echo "Stack $STACK_NAME does not exist. Creating..."
    
    # Skip CloudFront direct update - will be handled by CloudFormation
    echo "Skipping direct CloudFront update - will be handled by CloudFormation import..."
    
    # Create minimal template for import
    IMPORT_TEMPLATE="./cloudformation/import-template.yaml"
    cat > $IMPORT_TEMPLATE << 'EOF'
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Import template for existing bswdegree.org infrastructure'

Resources:
  # S3 bucket for website hosting
  WebsiteBucket:
    Type: AWS::S3::Bucket
    DeletionPolicy: Retain
    UpdateReplacePolicy: Retain
    Properties:
      BucketName: bswdegree.org
      CorsConfiguration:
        CorsRules:
          - AllowedHeaders:
              - '*'
            AllowedMethods:
              - GET
              - HEAD
            AllowedOrigins:
              - '*'
            MaxAge: 3000
        
  # CloudFront distribution - will be imported
  WebsiteDistribution:
    Type: AWS::CloudFront::Distribution
    DependsOn: WebsiteBucket
    DeletionPolicy: Retain
    UpdateReplacePolicy: Retain
    Properties:
      DistributionConfig:
        Comment: CloudFront distribution for bswdegree.org
        Enabled: true
        HttpVersion: http2
        PriceClass: PriceClass_100
        Origins:
          - DomainName: !GetAtt WebsiteBucket.DomainName
            Id: S3Origin
            S3OriginConfig:
              OriginAccessIdentity: ''
        DefaultRootObject: index.html
        CustomErrorResponses:
          - ErrorCode: 403
            ResponseCode: 200
            ResponsePagePath: /index.html
            ErrorCachingMinTTL: 300
          - ErrorCode: 404
            ResponseCode: 200
            ResponsePagePath: /index.html
            ErrorCachingMinTTL: 300
        DefaultCacheBehavior:
          AllowedMethods:
            - GET
            - HEAD
            - OPTIONS
          CachedMethods:
            - GET
            - HEAD
          Compress: true
          DefaultTTL: 86400
          ForwardedValues:
            Cookies:
              Forward: none
            QueryString: false
          MaxTTL: 31536000
          MinTTL: 0
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
EOF

    # Create new stack with imported resources
    echo "Creating CloudFormation stack with imported resources..."
    aws cloudformation create-change-set \
        --stack-name $STACK_NAME \
        --change-set-name ImportChangeSet \
        --change-set-type IMPORT \
        --template-body file://$IMPORT_TEMPLATE \
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
    
    echo "Stack created successfully! Now updating with full template..."
    
    # Update stack with full template including bucket policy
    aws cloudformation update-stack \
        --stack-name $STACK_NAME \
        --template-body file://$TEMPLATE_FILE \
        --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
        --profile $AWS_PROFILE
        
    echo "Waiting for stack update to complete..."
    aws cloudformation wait stack-update-complete \
        --stack-name $STACK_NAME \
        --profile $AWS_PROFILE
    
    echo "Stack updated successfully! CloudFront distribution has been imported and configured."
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
