#!/bin/bash

# S3とCloudFrontへのデプロイスクリプト
# 使用方法: ./scripts/deploy-to-s3.sh [stack-name]

set -e

STACK_NAME="${1:-dev-roar-lab-hp}"

echo "📦 Building Next.js application..."
npm run build

echo "🔍 Getting bucket name from CloudFormation stack: $STACK_NAME"
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue' \
  --output text)

if [ -z "$BUCKET_NAME" ]; then
  echo "❌ Error: Could not find bucket name. Make sure the CloudFormation stack exists."
  exit 1
fi

echo "📤 Uploading to S3 bucket: $BUCKET_NAME"
aws s3 sync out/ s3://$BUCKET_NAME/ --delete

echo "🔍 Getting CloudFront distribution ID..."
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text)

if [ -z "$DISTRIBUTION_ID" ]; then
  echo "❌ Error: Could not find CloudFront distribution ID."
  exit 1
fi

echo "🔄 Creating CloudFront invalidation..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)

echo "✅ Deployment complete!"
echo ""
echo "📊 Summary:"
echo "  - S3 Bucket: $BUCKET_NAME"
echo "  - CloudFront Distribution: $DISTRIBUTION_ID"
echo "  - Invalidation ID: $INVALIDATION_ID"
echo ""
echo "🌐 Getting website URL..."
WEBSITE_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
  --output text)

echo "  - Website URL: $WEBSITE_URL"
echo ""
echo "⏱️  Note: CloudFront invalidation may take a few minutes to complete."
