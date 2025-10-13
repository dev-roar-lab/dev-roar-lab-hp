# CloudFormation デプロイガイド

このディレクトリには、Next.js SSGアプリケーションをS3 + CloudFrontでホスティングするためのCloudFormationテンプレートが含まれています。

## 前提条件

1. AWS CLIがインストールされ、設定されていること
2. AWS認証情報が設定されていること（`aws configure`）
3. （オプション）カスタムドメインを使用する場合：
   - Route 53でホストゾーンが作成されていること
   - ACM証明書が**us-east-1リージョン**で作成されていること

## デプロイ手順

### 1. 基本デプロイ（CloudFrontのデフォルトドメインを使用）

```bash
aws cloudformation create-stack \
  --stack-name dev-roar-lab-hp \
  --template-body file://cloudformation/s3-cloudfront-hosting.yaml \
  --parameters \
    ParameterKey=ProjectName,ParameterValue=dev-roar-lab-hp
```

### 2. カスタムドメインを使用する場合

```bash
aws cloudformation create-stack \
  --stack-name dev-roar-lab-hp \
  --template-body file://cloudformation/s3-cloudfront-hosting.yaml \
  --parameters \
    ParameterKey=ProjectName,ParameterValue=dev-roar-lab-hp \
    ParameterKey=DomainName,ParameterValue=example.com \
    ParameterKey=ACMCertificateArn,ParameterValue=arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERTIFICATE_ID \
    ParameterKey=HostedZoneId,ParameterValue=Z1234567890ABC
```

### 3. デプロイ状態の確認

```bash
aws cloudformation describe-stacks --stack-name dev-roar-lab-hp
```

### 4. 出力値の取得

```bash
aws cloudformation describe-stacks \
  --stack-name dev-roar-lab-hp \
  --query 'Stacks[0].Outputs'
```

## コンテンツのデプロイ

### Next.jsアプリケーションのビルド

```bash
npm run build
```

### S3へのアップロード

```bash
# バケット名を取得
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name dev-roar-lab-hp \
  --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue' \
  --output text)

# ファイルをアップロード
aws s3 sync out/ s3://$BUCKET_NAME/ --delete

# CloudFrontキャッシュを無効化
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name dev-roar-lab-hp \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text)

aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"
```

## デプロイスクリプト例

便利なデプロイスクリプトを作成できます：

```bash
#!/bin/bash
# deploy.sh

set -e

echo "Building Next.js application..."
npm run build

echo "Getting bucket name from CloudFormation..."
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name dev-roar-lab-hp \
  --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue' \
  --output text)

echo "Uploading to S3 bucket: $BUCKET_NAME"
aws s3 sync out/ s3://$BUCKET_NAME/ --delete

echo "Getting CloudFront distribution ID..."
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name dev-roar-lab-hp \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text)

echo "Creating CloudFront invalidation..."
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

## スタックの更新

```bash
aws cloudformation update-stack \
  --stack-name dev-roar-lab-hp \
  --template-body file://cloudformation/s3-cloudfront-hosting.yaml \
  --parameters \
    ParameterKey=ProjectName,ParameterValue=dev-roar-lab-hp
```

## スタックの削除

```bash
# S3バケットを空にする
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name dev-roar-lab-hp \
  --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue' \
  --output text)

aws s3 rm s3://$BUCKET_NAME/ --recursive

# ログバケットも空にする
LOG_BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name dev-roar-lab-hp \
  --query 'Stacks[0].Outputs[?OutputKey==`LogBucketName`].OutputValue' \
  --output text)

aws s3 rm s3://$LOG_BUCKET_NAME/ --recursive

# スタックを削除
aws cloudformation delete-stack --stack-name dev-roar-lab-hp
```

## リソース構成

このテンプレートで作成されるリソース：

1. **S3バケット（Website）** - 静的ファイルを格納
2. **S3バケット（Logs）** - CloudFrontのアクセスログを保存（90日で自動削除）
3. **CloudFront Distribution** - CDN配信とHTTPS対応
4. **Origin Access Control (OAC)** - S3バケットへの安全なアクセス
5. **Route 53 Record** - カスタムドメインのDNSレコード（オプション）

## セキュリティ機能

- ✅ S3バケットはパブリックアクセス禁止
- ✅ CloudFront経由のみアクセス可能（OAC使用）
- ✅ HTTPS強制リダイレクト
- ✅ セキュリティヘッダー自動付与
- ✅ アクセスログ記録

## トラブルシューティング

### CloudFrontで404エラーが出る

- キャッシュが原因の可能性があります。キャッシュ無効化を実行してください
- Next.jsの`index.html`が正しく配置されているか確認してください

### カスタムドメインが使えない

- ACM証明書が**us-east-1リージョン**にあることを確認してください
- Route 53のネームサーバーが正しく設定されているか確認してください
- CloudFrontの証明書検証には最大48時間かかる場合があります

## コスト見積もり

個人HPの想定（月間訪問者1000人程度）：

- S3ストレージ: $0.5/月
- CloudFront: $1-2/月
- Route 53: $0.5/月（カスタムドメイン使用時）

**合計: 約$2-3/月**
