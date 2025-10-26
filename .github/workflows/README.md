# GitHub Actions CI/CD Setup

このディレクトリには、GitHub ActionsでCI/CDを実行するためのワークフローファイルが含まれています。

## ワークフロー概要

このプロジェクトでは、**セキュリティを重視した3段階のCI/CDパイプライン**を採用しています：

```
1. CI実行（自動） → 2. 手動承認（必須） → 3. デプロイ実行（自動）
```

### フロー図

```
PR作成 → CI実行 → ✅/❌ 結果表示
   ↓
mainにマージ → CI実行 → ✅ 成功
   ↓
手動承認待機（GitHub Environment: production）
   ↓
承認後 → AWS S3デプロイ + GitHub Pagesデプロイ（並列実行）
```

## ワークフロー詳細

### 1. CI (`ci.yml`)

**トリガー:**

- PR作成時（mainブランチ向け）
- main/developブランチへのpush時

**実行内容:**

- コードフォーマットチェック (`npm run verify-format`)
- ESLintによるリンティング (`npm run lint`)
- TypeScript型チェック (`npx tsc --noEmit`)
- ユニットテスト実行 (`npm test -- --run`)
- ビルド (`npm run build`)
- ビルド成果物のアップロード（7日間保持）
- Playwrightアクセシビリティテスト (`npm run test:a11y`)

**セキュリティ:**

- 権限を最小化（`permissions: contents: read`）
- PRからはシークレットにアクセス不可

### 2. Deploy to AWS (`deploy.yml`)

**トリガー:**

- CIワークフローが**成功**した後のみ（`workflow_run`）
- mainブランチのみ

**実行内容:**

- CIで生成したビルド成果物をダウンロード（再ビルド不要）
- AWS認証（OIDC + Role Chaining）
- S3へのデプロイ (`aws s3 sync`)
- CloudFrontキャッシュの無効化 (`aws cloudfront create-invalidation`)

**セキュリティ:**

- **手動承認が必須**（GitHub Environment: `production`）
- CI失敗時はデプロイをスキップ
- mainブランチからのみデプロイ可能

### 3. Deploy Documentation (`deploy-docs.yml`)

**トリガー:**

- CIワークフローが**成功**した後のみ（`workflow_run`）
- mainブランチのみ
- 手動実行も可能（`workflow_dispatch`）

**実行内容:**

- Storybookドキュメントのビルド (`npm run docs:build`)
- GitHub Pagesへのデプロイ

**セキュリティ:**

- **手動承認が必須**（GitHub Environment: `production`）
- CI失敗時はデプロイをスキップ

## セットアップ手順

### 0. 事前準備：GitHub設定

#### 0-1. GitHub Environment設定（必須）

デプロイに手動承認を必要とするため、`production` Environmentを作成します。

1. Settings → Environments → "New environment"
2. 名前: `production`
3. "Environment protection rules" で以下を設定:
   - ✅ **Required reviewers**: デプロイ承認者を追加（1名以上）
   - ✅ **Deployment branches**: "Selected branches" → `main` を追加

**注意:** この設定がない場合、デプロイワークフローは実行されません。

#### 0-2. Branch Protection Rules設定（必須）

mainブランチを保護し、CIが通っていないPRをマージできないようにします。

1. Settings → Branches → "Add branch protection rule"
2. Branch name pattern: `main`
3. 以下を有効化:
   - ✅ **Require a pull request before merging**
     - Require approvals: 1
   - ✅ **Require status checks to pass before merging**
     - ✅ Require branches to be up to date before merging
     - Status checks: `test` を選択（CI実行後に表示されます）
   - ✅ **Require conversation resolution before merging**
   - ✅ **Do not allow bypassing the above settings**

**効果:** CIが失敗したPRはマージできなくなります。

#### 0-3. CODEOWNERS設定（推奨）

ワークフローファイルの変更に対してレビューを必須化します。

`.github/CODEOWNERS` ファイルが既に作成されています。

```
/.github/workflows/ @dev-roar-lab/admins
/cloudformation/ @dev-roar-lab/admins
```

**注意:** `@dev-roar-lab/admins` を実際のGitHubユーザー名またはチーム名に変更してください。

Branch Protection Rulesで "Require review from Code Owners" を有効化することで、ワークフローファイルの変更には必ずレビューが必要になります。

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

**重要:** セキュリティのため、デプロイ関連のシークレットは**Environment secrets**として設定してください。

#### 2-1. Environment Secrets（production環境）

Settings → Environments → `production` → "Environment secrets" で以下を設定:

| Secret名                     | 説明                                       | 例                                                       |
| ---------------------------- | ------------------------------------------ | -------------------------------------------------------- |
| `AWS_BRIDGE_ROLE_ARN`        | Bridge RoleのARN（Role Chaining 1段目）    | `arn:aws:iam::123456789012:role/GitHubActionsBridgeRole` |
| `AWS_EXECUTION_ROLE_ARN`     | Execution RoleのARN（Role Chaining 2段目） | `arn:aws:iam::123456789012:role/GitHubActionsExecRole`   |
| `AWS_REGION`                 | AWSリージョン                              | `ap-northeast-1`                                         |
| `S3_BUCKET_NAME`             | デプロイ先のS3バケット名                   | `dev-roar-lab-hp-website`                                |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFrontディストリビューションID         | `E1234567890ABC`                                         |

#### 2-2. Repository Secrets

Settings → Secrets and variables → Actions → "Repository secrets" で以下を設定:

| Secret名            | 説明                           | 例             |
| ------------------- | ------------------------------ | -------------- |
| `GA_MEASUREMENT_ID` | Google Analytics測定ID（任意） | `G-XXXXXXXXXX` |

**なぜEnvironment secretsを使うのか？**

- Environment secretsは、指定したEnvironment（`production`）でのみアクセス可能
- 手動承認が必要なため、不正なアクセスを防止
- PRやforkからはアクセス不可能

### 3. 動作確認

#### 3-1. PRのCI実行確認

1. 新しいブランチを作成してPRを作成
2. GitHub Actionsの「Actions」タブで実行状況を確認
3. CIが自動実行されることを確認
4. **デプロイワークフローは実行されない**ことを確認（PRからはトリガーされない）

#### 3-2. mainへのマージとデプロイ

1. PRをmainブランチにマージ
2. CIワークフローが自動実行されることを確認
3. CI成功後、`Deploy to AWS` と `Deploy Documentation` ワークフローが**待機状態**になることを確認
4. Actions → 該当のワークフロー → "Review deployments" ボタンをクリック
5. 承認者が内容を確認し、"Approve and deploy" をクリック
6. デプロイが実行されることを確認
7. Summary画面に以下が表示されることを確認:
   - S3バケット名
   - CloudFrontディストリビューションID
   - 無効化ID

#### 3-3. CIが失敗したPRのマージブロック

1. 意図的にCIが失敗する変更を加える（例: lintエラー）
2. PRを作成
3. CIが失敗することを確認
4. **PRのマージボタンがブロックされている**ことを確認（Branch Protection Rules有効時）

**期待される動作:**

```
✅ CI成功 → 手動承認待機 → 承認 → デプロイ実行
❌ CI失敗 → デプロイワークフローは起動しない
```

## トラブルシューティング

### デプロイワークフローが起動しない

**症状:** mainにマージしてもデプロイワークフローが表示されない

**原因と対処:**

1. **CIが失敗している**

   - Actions → CI ワークフローの結果を確認
   - エラーを修正してから再度mainにpush

2. **workflow_runトリガーの遅延**

   - CIワークフロー完了後、数秒〜数十秒の遅延が発生する場合があります
   - 少し待ってから Actions タブをリロード

3. **Environment (`production`) が未設定**
   - Settings → Environments で `production` Environmentが作成されているか確認
   - Environment protection rulesが設定されているか確認

### デプロイワークフローが "Waiting" 状態で止まっている

**症状:** デプロイワークフローが黄色の "Waiting for approval" 状態

**対処:**

これは正常な動作です。手動承認が必要です。

1. Actions → 該当のワークフロー実行をクリック
2. "Review deployments" ボタンをクリック
3. 内容を確認して "Approve and deploy" をクリック

**注意:** 承認者として設定されたユーザーのみが承認できます。

### エラー: "Resource not accessible by integration" (download-artifact)

**症状:** デプロイワークフローでアーティファクトのダウンロードに失敗

**原因と対処:**

1. **権限不足**

   - `deploy.yml` の `permissions` に `actions: read` が含まれているか確認

2. **アーティファクトの保持期間切れ**

   - CIで生成されたアーティファクトは7日間保持されます
   - 7日以上経過したコミットのデプロイは失敗します
   - 対処: mainブランチに空コミットをpushしてCIを再実行

3. **CI実行IDの不一致**
   - `workflow_run` イベントが正しくトリガーされていない可能性
   - Actions タブでCIとデプロイのワークフロー実行時刻を確認

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

## セキュリティベストプラクティス

### 実装済みの対策

✅ **権限の最小化**

- CIワークフローは `permissions: contents: read` のみ
- デプロイワークフローは必要最小限の権限のみ付与

✅ **シークレットの保護**

- デプロイ関連シークレットはEnvironment secretsとして管理
- PRやforkからはアクセス不可能

✅ **手動承認フロー**

- 本番環境へのデプロイには承認者の承認が必須
- 承認者のみがデプロイを許可可能

✅ **ワークフロー変更の保護**

- CODEOWNERSによりワークフローファイルの変更にレビューを必須化
- Branch Protection Rulesによりmainブランチを保護

✅ **workflow_runによる分離**

- デプロイワークフローはCIワークフロー完了後のみ実行
- PRから直接デプロイワークフローをトリガー不可能

### 追加で検討すべき対策

- IP制限（特定のIPアドレスからのデプロイのみ許可）
- デプロイ履歴の監査ログ取得
- Slack等への通知連携

## 参考資料

### GitHub Actions

- [GitHub Actions - OpenID Connect](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [GitHub - Using environments for deployment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [GitHub - Security hardening for GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [GitHub - Managing a branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)
- [GitHub - About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

### AWS

- [AWS - GitHub Actions との OIDC](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
- [aws-actions/configure-aws-credentials](https://github.com/aws-actions/configure-aws-credentials)
