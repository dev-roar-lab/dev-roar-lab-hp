# GitHub Actions Setup Scripts

このディレクトリには、GitHub ActionsのCI/CD環境を自動セットアップするためのスクリプトが含まれています。

## セットアップスクリプト

### `setup-cicd.sh`

GitHub CLI (`gh`) を使用して、以下を自動的に設定します：

1. **Production Environment の作成**

   - 手動承認が必要な本番環境を作成
   - デプロイ承認者の設定

2. **Branch Protection Rules の設定**

   - mainブランチの保護
   - CI必須化
   - PRレビュー必須化
   - CODEOWNERSレビュー必須化

3. **Environment Secrets の設定**（オプション）
   - AWS認証情報
   - S3バケット名
   - CloudFront設定

## 使い方

### 前提条件

1. **GitHub CLI のインストール**

   ```bash
   # macOS (Homebrew)
   brew install gh

   # Ubuntu/Debian
   sudo apt install gh

   # Windows (Scoop)
   scoop install gh
   ```

2. **GitHub CLI の認証**

   ```bash
   gh auth login
   ```

   認証時に必要な権限:

   - `repo` (full control of private repositories)
   - `workflow` (update GitHub Action workflows)
   - `admin:org` (for organization repositories)

### 実行方法

```bash
# リポジトリルートから実行
.github/scripts/setup-cicd.sh
```

### インタラクティブな設定

スクリプトは以下を対話的に尋ねます：

1. **デプロイ承認者のGitHubユーザー名**

   ```
   Enter GitHub username(s) for deployment approval (comma-separated): alice,bob
   ```

   複数のユーザーを指定する場合はカンマ区切りで入力してください。

2. **Environment Secrets の設定**
   ```
   Do you want to set Environment secrets now? (y/N): y
   ```
   `y` を選択すると、以下のシークレットを対話的に設定できます：
   - AWS_BRIDGE_ROLE_ARN
   - AWS_EXECUTION_ROLE_ARN
   - AWS_REGION
   - S3_BUCKET_NAME
   - CLOUDFRONT_DISTRIBUTION_ID
   - GA_MEASUREMENT_ID (optional)

### 手動でのSecrets設定

スクリプト実行後、または後で手動で設定する場合：

```bash
# Environment Secrets (production環境)
gh secret set AWS_BRIDGE_ROLE_ARN --env production
gh secret set AWS_EXECUTION_ROLE_ARN --env production
gh secret set AWS_REGION --env production
gh secret set S3_BUCKET_NAME --env production
gh secret set CLOUDFRONT_DISTRIBUTION_ID --env production

# Repository Secrets
gh secret set GA_MEASUREMENT_ID
```

各コマンド実行後、プロンプトでシークレットの値を入力します。

または、ファイルから読み込む場合：

```bash
gh secret set AWS_BRIDGE_ROLE_ARN --env production < secret-value.txt
```

## 設定の確認

### Environment設定の確認

```bash
gh api repos/:owner/:repo/environments/production | jq
```

### Branch Protection Rulesの確認

```bash
gh api repos/:owner/:repo/branches/main/protection | jq
```

### Secretsの確認（値は表示されません）

```bash
# Environment Secrets
gh secret list --env production

# Repository Secrets
gh secret list
```

## トラブルシューティング

### 権限エラーが発生する場合

```
Error: HTTP 403: Resource not accessible by integration
```

**原因:** GitHub CLI の認証スコープが不足しています。

**対処:**

```bash
gh auth refresh -s admin:org,repo,workflow
```

### Branch Protection Rules が設定できない

**原因:** Branch Protection Rules の設定には管理者権限が必要です。

**対処:**

1. リポジトリの管理者権限を持つアカウントで実行
2. または、GitHub WebUIで手動設定：
   - Settings → Branches → Add branch protection rule

### Environmentが作成されない

**原因:** Private リポジトリの場合、GitHub Free プランでは Environments が利用できません。

**対処:**

- GitHub Pro または GitHub Team プランにアップグレード
- または、Organization の Public リポジトリで利用

## 参考資料

- [GitHub CLI Manual](https://cli.github.com/manual/)
- [GitHub REST API - Environments](https://docs.github.com/en/rest/deployments/environments)
- [GitHub REST API - Branch Protection](https://docs.github.com/en/rest/branches/branch-protection)
- [GitHub CLI - gh secret](https://cli.github.com/manual/gh_secret)
