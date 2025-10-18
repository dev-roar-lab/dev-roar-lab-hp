# CloudFormation デプロイガイド

このディレクトリには、Next.js SSGアプリケーションをS3 + CloudFrontでホスティングするためのCloudFormationテンプレートが含まれています。

## テンプレート一覧

| ファイル名                   | 説明                                       | スタック名（推奨）          |
| ---------------------------- | ------------------------------------------ | --------------------------- |
| `s3-cloudfront-hosting.yaml` | S3バケット、CloudFront、ログバケットを作成 | `dev-roar-lab-hp`           |
| `cicd-role.yaml`             | GitHub Actions用のIAMロールを作成          | `dev-roar-lab-hp-cicd-role` |

## 前提条件

1. AWS CLIがインストールされ、設定されていること
2. AWS認証情報が設定されていること（`aws configure`）
3. （オプション）カスタムドメインを使用する場合：
   - Route 53でホストゾーンが作成されていること
   - ACM証明書が**us-east-1リージョン**で作成されていること

## デプロイ手順

### ステップ1: ホスティング環境のデプロイ

#### 1-1. 基本デプロイ（CloudFrontのデフォルトドメインを使用）

```bash
aws cloudformation create-stack \
  --stack-name dev-roar-lab-hp \
  --template-body file://cloudformation/s3-cloudfront-hosting.yaml \
  --parameters \
    ParameterKey=ProjectName,ParameterValue=dev-roar-lab-hp
```

#### 1-2. カスタムドメインを使用する場合

```bash
aws cloudformation create-stack \
  --stack-name dev-roar-lab-hp \
  --template-body file://cloudformation/s3-cloudfront-hosting.yaml \
  --parameters \
    ParameterKey=ProjectName,ParameterValue=dev-roar-lab-hp \
    ParameterKey=DomainName,ParameterValue=example.com \
    ParameterKey=ACMCertificateArn,ParameterValue=arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERTIFICATE_ID
```

**注意**: このテンプレートはRoute53のDNSレコードを作成しません。共通のDNS管理で以下のAliasレコードを作成してください：

- **名前**: example.com
- **タイプ**: A（IPv4アドレス）
- **エイリアス**: はい
- **エイリアスターゲット**: CloudFrontディストリビューションのドメイン名（Outputsから取得）
- **ホストゾーンID**: Z2FDTNDATAQYW2（CloudFrontの固定値）

### ステップ2: GitHub Actions用IAMロールのデプロイ

CI/CDを設定する場合、GitHub ActionsからS3とCloudFrontにアクセスするためのIAMロールを作成します。

**前提条件:**

- OIDCプロバイダーが作成済みであること（詳細は `.github/workflows/README.md` 参照）

```bash
# S3バケット名とCloudFrontディストリビューションIDを取得
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name dev-roar-lab-hp \
  --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue' \
  --output text)

DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name dev-roar-lab-hp \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text)

# IAMロールスタックを作成
aws cloudformation create-stack \
  --stack-name dev-roar-lab-hp-cicd-role \
  --template-body file://cloudformation/cicd-role.yaml \
  --parameters \
    ParameterKey=ProjectName,ParameterValue=dev-roar-lab-hp \
    ParameterKey=GitHubOrg,ParameterValue=dev-roar-lab \
    ParameterKey=GitHubRepo,ParameterValue=dev-roar-lab-hp \
    ParameterKey=OIDCProviderArn,ParameterValue=arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com \
    ParameterKey=S3BucketName,ParameterValue=$BUCKET_NAME \
    ParameterKey=CloudFrontDistributionId,ParameterValue=$DISTRIBUTION_ID \
  --capabilities CAPABILITY_NAMED_IAM
```

**IAMロールARNの取得（GitHub Secretsに設定する値）:**

```bash
aws cloudformation describe-stacks \
  --stack-name dev-roar-lab-hp-cicd-role \
  --query 'Stacks[0].Outputs[?OutputKey==`GitHubActionsRoleArn`].OutputValue' \
  --output text
```

### ステップ3: デプロイ状態の確認

```bash
aws cloudformation describe-stacks --stack-name dev-roar-lab-hp
```

### ステップ4: 出力値の取得

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

### `s3-cloudfront-hosting.yaml` で作成されるリソース

1. **S3バケット（Website）** - 静的ファイルを格納
2. **S3バケット（Logs）** - CloudFrontのアクセスログを保存（90日で自動削除）
3. **CloudFront Distribution** - CDN配信とHTTPS対応
4. **Origin Access Control (OAC)** - S3バケットへの安全なアクセス

**注意**: Route53のDNSレコードは含まれていません。共通のDNS管理で設定してください。

### `cicd-role.yaml` で作成されるリソース

1. **IAMロール（GitHubActionsDeployRole）** - GitHub Actions用のデプロイロール
   - 信頼ポリシー: OIDCプロバイダー経由でのAssumeRoleを許可
   - 権限ポリシー: S3バケットへのアクセスとCloudFrontキャッシュ無効化

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
- CloudFrontの証明書検証には最大48時間かかる場合があります
- DNSレコードが正しく設定されているか確認してください

  ```bash
  # CloudFrontドメイン名を取得
  aws cloudformation describe-stacks \
    --stack-name dev-roar-lab-hp \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
    --output text

  # 共通のDNS管理でこのドメインをAliasレコードとして設定
  ```

## コスト見積もり

個人HPの想定（月間訪問者1000人程度）：

- S3ストレージ: $0.5/月
- CloudFront: $1-2/月
- Route 53: $0.5/月（カスタムドメイン使用時）

**合計: 約$2-3/月**
