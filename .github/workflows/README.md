# GitHub Actions CI/CD Setup

このディレクトリには、GitHub ActionsでCI/CDを実行するためのワークフローファイルが含まれています。

## ワークフロー

### 1. CI (`ci.yml`)

PR作成時やmain/developブランチへのpush時に実行されます。

**実行内容:**

- コードフォーマットチェック (`npm run verify-format`)
- ESLintによるリンティング (`npm run lint`)
- TypeScript型チェック (`npx tsc --noEmit`)
- ユニットテスト実行 (`npm test -- --run`)
- ビルド (`npm run build`)
- ビルド成果物のアップロード（7日間保持）

### 2. Deploy (`deploy.yml`)

mainブランチへのpush時にAWSへ自動デプロイを実行します。

**実行内容:**

- ビルド (`npm run build`)
- AWS認証（OIDC + Assume Role）
- S3へのデプロイ (`aws s3 sync`)
- CloudFrontキャッシュの無効化 (`aws cloudfront create-invalidation`)

## セットアップ手順

### 1. AWS IAM設定

#### 1-1. OIDC プロバイダーの作成

GitHub ActionsからAWSにアクセスするためのOIDCプロバイダーを作成します。

**注意:** OIDCプロバイダーは共有リソース管理アカウントで作成しても構いません。その場合、IAMロールの信頼ポリシーで他アカウントのOIDCプロバイダーを参照してください。

```bash
# AWS CLIで実行（共有リソース管理アカウントまたはHP管理アカウント）
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

#### 1-2. IAMロールの作成

HP管理アカウントに以下の権限を持つIAMロールを作成します。

**信頼ポリシー（Trust Policy）:**

OIDCプロバイダーを**同じアカウント**で作成した場合:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<HP管理アカウントID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:<GITHUB_ORG>/<REPO_NAME>:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

OIDCプロバイダーを**共有リソース管理アカウント**で作成した場合:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<共有リソース管理アカウントID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:<GITHUB_ORG>/<REPO_NAME>:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

**アクセス許可ポリシー（Permissions Policy）:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::<BUCKET_NAME>", "arn:aws:s3:::<BUCKET_NAME>/*"]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "arn:aws:cloudfront::<HP管理アカウントID>:distribution/<DISTRIBUTION_ID>"
    }
  ]
}
```

### 2. GitHub Secrets設定

リポジトリの Settings → Secrets and variables → Actions で以下のシークレットを設定してください。

| Secret名                     | 説明                               | 例                                                       |
| ---------------------------- | ---------------------------------- | -------------------------------------------------------- |
| `AWS_ROLE_ARN`               | Assume RoleするIAMロールのARN      | `arn:aws:iam::123456789012:role/GitHubActionsDeployRole` |
| `AWS_REGION`                 | AWSリージョン                      | `ap-northeast-1`                                         |
| `S3_BUCKET_NAME`             | デプロイ先のS3バケット名           | `dev-roar-lab-hp-website`                                |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFrontディストリビューションID | `E1234567890ABC`                                         |

### 3. 動作確認

1. mainブランチにpushする
2. GitHub Actionsの「Actions」タブで実行状況を確認
3. デプロイが成功すると、Summary画面に以下が表示されます:
   - S3バケット名
   - CloudFrontディストリビューションID
   - 無効化ID

## トラブルシューティング

### エラー: "Error: Credentials could not be loaded"

IAMロールの信頼ポリシーが正しく設定されているか確認してください。

**チェックポイント:**

- OIDCプロバイダーのARNが正しいか（特にクロスアカウントの場合）
- リポジトリ名（`<GITHUB_ORG>/<REPO_NAME>`）が正しいか
- ブランチ名（`ref:refs/heads/main`）が正しいか

### エラー: "Access Denied" (S3操作時)

IAMロールの権限ポリシーでS3バケットへのアクセス権限が正しく設定されているか確認してください。

**必要な権限:**

- `s3:PutObject` - ファイルアップロード
- `s3:GetObject` - ファイル取得（sync時の比較用）
- `s3:DeleteObject` - ファイル削除（`--delete`オプション使用時）
- `s3:ListBucket` - バケット内のファイル一覧取得

**バケット名の確認:**

- GitHub Secretsの`S3_BUCKET_NAME`が正しいか
- IAMポリシーのResource ARNにバケット名が正しく指定されているか

### エラー: "Access Denied" (CloudFront操作時)

CloudFrontへのアクセス権限が正しく設定されているか確認してください。

**必要な権限:**

- `cloudfront:CreateInvalidation` - キャッシュ無効化

**ディストリビューションIDの確認:**

- GitHub Secretsの`CLOUDFRONT_DISTRIBUTION_ID`が正しいか
- IAMポリシーのResource ARNにディストリビューションIDが正しく指定されているか

## 参考資料

- [GitHub Actions - OpenID Connect](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [AWS - GitHub Actions との OIDC](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
- [aws-actions/configure-aws-credentials](https://github.com/aws-actions/configure-aws-credentials)
