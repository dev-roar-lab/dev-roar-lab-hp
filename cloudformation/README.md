# CloudFormation デプロイガイド

このディレクトリには、Next.js SSGアプリケーションをS3 + CloudFrontでホスティングするためのCloudFormationテンプレートが含まれています。

## テンプレート一覧

| ファイル名                   | 説明                                                       | スタック名（推奨）              |
| ---------------------------- | ---------------------------------------------------------- | ------------------------------- |
| `s3-cloudfront-hosting.yaml` | S3バケット、CloudFront、ログバケットを作成                 | `dev-roar-lab-hp`               |
| `apex-redirect.yaml`         | Apex domainからwww subdomainへのリダイレクト用インフラ作成 | `dev-roar-lab-hp-apex-redirect` |
| `cicd-role.yaml`             | GitHub Actions用のIAMロールを作成                          | `dev-roar-lab-hp-cicd-role`     |

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

### ステップ1.5: Apex Domainリダイレクトのデプロイ（オプション）

Apex domain（例：`example.com`）からwww subdomain（例：`www.example.com`）へのリダイレクトを設定する場合、以下の手順でリダイレクト専用のインフラを構築します。

**前提条件:**

- ステップ1でwww subdomainのホスティング環境が構築済みであること
- ACM証明書がApex domainもカバーしていること（ワイルドカード証明書 `*.example.com` + `example.com` を推奨）

**アーキテクチャ:**

このテンプレートは、AWS公式のベストプラクティスに従い、以下のリソースを作成します：

- **S3バケット**: リダイレクト専用（S3 website hosting機能を使用）
- **CloudFront**: Apex domain用の新しいディストリビューション
- **ログバケット**: CloudFrontアクセスログ保存用（90日で自動削除）

#### デプロイコマンド

```bash
aws cloudformation create-stack \
  --stack-name dev-roar-lab-hp-apex-redirect \
  --template-body file://cloudformation/apex-redirect.yaml \
  --parameters \
    ParameterKey=ProjectName,ParameterValue=dev-roar-lab-hp \
    ParameterKey=ApexDomain,ParameterValue=example.com \
    ParameterKey=TargetDomain,ParameterValue=www.example.com \
    ParameterKey=ACMCertificateArn,ParameterValue=arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERTIFICATE_ID
```

#### Route53 DNSレコードの作成

スタックのデプロイが完了したら、Route53でApex domainのAliasレコードを作成します：

```bash
# CloudFrontドメイン名を取得
APEX_CF_DOMAIN=$(aws cloudformation describe-stacks \
  --stack-name dev-roar-lab-hp-apex-redirect \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
  --output text)

echo "Route53で以下のAliasレコードを作成してください："
echo "  名前: example.com"
echo "  タイプ: A"
echo "  エイリアス: はい"
echo "  エイリアスターゲット: $APEX_CF_DOMAIN"
echo "  ホストゾーンID: Z2FDTNDATAQYW2"
```

**または、AWS CLIで自動作成:**

```bash
# ホストゾーンIDを取得
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name \
  --dns-name example.com \
  --query 'HostedZones[0].Id' \
  --output text | cut -d'/' -f3)

# Aliasレコードを作成
aws route53 change-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "example.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "'"$APEX_CF_DOMAIN"'",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'
```

#### テスト

```bash
# リダイレクトが正しく動作するか確認
curl -I https://example.com

# 期待される出力:
# HTTP/2 301
# location: https://www.example.com/
```

**重要な注意事項:**

- このテンプレートは**リダイレクト専用**です。コンテンツをアップロードする必要はありません
- S3 website hosting機能により、すべてのリクエストが自動的にターゲットドメインにリダイレクトされます
- 追加コスト：CloudFrontディストリビューションの固定費（約$0.60/月）のみ

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

### メインホスティング環境の削除

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

### Apex Domainリダイレクト環境の削除

```bash
# リダイレクトバケットを空にする（通常は空だが念のため）
REDIRECT_BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name dev-roar-lab-hp-apex-redirect \
  --query 'Stacks[0].Outputs[?OutputKey==`RedirectBucketName`].OutputValue' \
  --output text)

aws s3 rm s3://$REDIRECT_BUCKET_NAME/ --recursive

# ログバケットも空にする
REDIRECT_LOG_BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name dev-roar-lab-hp-apex-redirect \
  --query 'Stacks[0].Outputs[?OutputKey==`LogBucketName`].OutputValue' \
  --output text)

aws s3 rm s3://$REDIRECT_LOG_BUCKET_NAME/ --recursive

# スタックを削除
aws cloudformation delete-stack --stack-name dev-roar-lab-hp-apex-redirect
```

**注意**: スタック削除前に、Route53のDNSレコード（Apex domainのAレコード）を手動で削除してください。

## リソース構成

### `s3-cloudfront-hosting.yaml` で作成されるリソース

1. **S3バケット（Website）** - 静的ファイルを格納
2. **S3バケット（Logs）** - CloudFrontのアクセスログを保存（90日で自動削除）
3. **CloudFront Distribution** - CDN配信とHTTPS対応
4. **Origin Access Control (OAC)** - S3バケットへの安全なアクセス

**注意**: Route53のDNSレコードは含まれていません。共通のDNS管理で設定してください。

### `apex-redirect.yaml` で作成されるリソース

1. **S3バケット（Redirect）** - リダイレクト専用バケット（S3 website hosting有効化）
2. **S3バケット（Logs）** - CloudFrontのアクセスログを保存（90日で自動削除）
3. **CloudFront Distribution** - Apex domain用のCDN配信とHTTPS対応
4. **Response Headers Policy** - セキュリティヘッダーポリシー

**特徴:**

- S3 website hostingの`RedirectAllRequestsTo`機能を使用
- コンテンツアップロード不要（自動リダイレクト）
- AWS公式のベストプラクティスに準拠

**注意**: Route53のDNSレコード（Apex domainのAレコード）は含まれていません。デプロイ後に手動で設定してください。

### `cicd-role.yaml` で作成されるリソース

1. **IAMロール（GitHubActionsDeployRole）** - GitHub Actions用のデプロイロール
   - 信頼ポリシー: OIDCプロバイダー経由でのAssumeRoleを許可
   - 権限ポリシー: S3バケットへのアクセスとCloudFrontキャッシュ無効化

## セキュリティ機能

### インフラストラクチャセキュリティ

- ✅ **S3バケット**: パブリックアクセス完全禁止
- ✅ **Origin Access Control (OAC)**: CloudFront経由のみアクセス可能
- ✅ **HTTPS強制**: すべてのHTTPリクエストをHTTPSにリダイレクト
- ✅ **アクセスログ**: CloudFrontログを90日間保持（自動削除）
- ✅ **バージョニング**: S3バケットのバージョニング有効化

### カスタムセキュリティヘッダーポリシー

CloudFrontのカスタムレスポンスヘッダーポリシーにより、以下のセキュリティヘッダーを自動付与：

#### 1. Strict-Transport-Security (HSTS)

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

- 2年間（63072000秒）ブラウザにHTTPS接続を強制
- サブドメインも含む
- HSTS Preloadリストに登録可能

#### 2. X-Content-Type-Options

```
X-Content-Type-Options: nosniff
```

- ブラウザのMIMEタイプ推測を禁止
- XSS攻撃リスクを軽減

#### 3. X-Frame-Options

```
X-Frame-Options: DENY
```

- iframe埋め込みを完全禁止
- クリックジャッキング攻撃を防止

#### 4. Referrer-Policy

```
Referrer-Policy: strict-origin-when-cross-origin
```

- クロスオリジンリクエスト時は参照元のオリジンのみ送信
- プライバシー保護

#### 5. X-XSS-Protection

```
X-XSS-Protection: 1; mode=block
```

- ブラウザのXSS保護機能を有効化（レガシーブラウザ対応）

#### 6. Content-Security-Policy (CSP)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

**ポリシーの詳細**:

- `default-src 'self'`: デフォルトは同一オリジンのみ許可
- `script-src`: スクリプトは同一オリジン + インライン + eval（Next.js要件）
- `style-src`: スタイルは同一オリジン + インライン
- `img-src`: 画像は同一オリジン + data URI + HTTPS
- `font-src`: フォントは同一オリジン + data URI
- `connect-src`: API接続は同一オリジンのみ
- `frame-ancestors 'none'`: iframe埋め込み禁止
- `base-uri 'self'`: `<base>`タグの制限
- `form-action 'self'`: フォーム送信先を同一オリジンに制限

**注意**: `'unsafe-inline'`と`'unsafe-eval'`は、Next.jsの動的コード実行とReact Hydrationのために必要です。将来的にはnonce/hash方式への移行を推奨します。

#### 7. Permissions-Policy

```
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

- 位置情報、マイク、カメラへのアクセスを全て禁止

### セキュリティスコア

このセキュリティ設定により、以下のスキャンツールで高スコアを取得できます：

- **Mozilla Observatory**: A+ランク目標
- **Security Headers**: Aランク目標
- **SSL Labs**: A+ランク（HTTPS設定による）

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

### Apex domainリダイレクトが動作しない

- **DNSレコードの確認**: Apex domainのAレコードが正しくCloudFrontを向いているか確認

  ```bash
  # DNS解決を確認
  dig example.com
  nslookup example.com
  ```

- **S3バケットのWebsite Hosting設定を確認**: S3コンソールでリダイレクト設定が有効になっているか確認

  ```bash
  # S3バケットのwebsite設定を取得
  REDIRECT_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name dev-roar-lab-hp-apex-redirect \
    --query 'Stacks[0].Outputs[?OutputKey==`RedirectBucketName`].OutputValue' \
    --output text)

  aws s3api get-bucket-website --bucket $REDIRECT_BUCKET
  ```

- **CloudFrontのOrigin設定を確認**: OriginがS3 website endpoint（`*.s3-website-*.amazonaws.com`）を指しているか確認（S3 REST endpointではない）

- **ACM証明書のカバレッジ確認**: 証明書がApex domainもカバーしているか確認（ワイルドカード証明書は `*.example.com` のみで `example.com` はカバーしないため注意）

- **リダイレクトのテスト**:

  ```bash
  # HTTPSリダイレクトを確認（-Lオプションでリダイレクトを追跡）
  curl -L -I https://example.com

  # または詳細なリダイレクトチェーン確認
  curl -v https://example.com 2>&1 | grep -E '(HTTP|location:)'
  ```

## コスト見積もり

### 基本構成（www subdomainのみ）

個人HPの想定（月間訪問者1000人程度）：

- S3ストレージ: $0.5/月
- CloudFront: $1-2/月
- Route 53: $0.5/月（カスタムドメイン使用時）

**合計: 約$2-3/月**

### Apex domainリダイレクト追加時

上記に加えて：

- S3ストレージ（リダイレクト用）: $0.01/月未満（ほぼ無料）
- CloudFront（リダイレクト用）: $0.60/月（固定費）
- データ転送: $0.01/月未満（リダイレクトのみのため）

**追加コスト: 約$0.60/月**

**合計: 約$2.6-3.6/月**
