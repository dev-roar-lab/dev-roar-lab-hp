# GitHub Actions CI/CD 改善計画

**作成日:** 2025-10-26
**対象リポジトリ:** dev-roar-lab/dev-roar-lab-hp

## 📊 現状分析

### 既存のワークフロー構成

| ワークフロー      | トリガー                     | 実行内容                                                           | 問題点                                         |
| ----------------- | ---------------------------- | ------------------------------------------------------------------ | ---------------------------------------------- |
| `ci.yml`          | PR作成、main/developへのpush | フォーマットチェック、lint、テスト、ビルド、アクセシビリティテスト | ✓ 問題なし                                     |
| `deploy.yml`      | mainへのpush                 | AWS S3への自動デプロイ                                             | ✗ 手動承認なし<br>✗ CI失敗時も実行される可能性 |
| `deploy-docs.yml` | mainへのpush                 | GitHub Pagesへの自動デプロイ                                       | ✗ 手動承認なし<br>✗ CI失敗時も実行される可能性 |

### 特定された課題

1. **デプロイの自動実行**

   - mainへのpushで手動承認なしに即座にデプロイされる
   - CI/CDのパイプラインが分離されており、CI失敗時でもデプロイが走る可能性がある

2. **PRマージ保護が未設定**

   - CIが失敗していてもPRをマージできる状態
   - Branch Protection Rulesが未設定

3. **セキュリティリスク（public repository）**
   - ワークフローファイルの編集権限が保護されていない
   - 悪意あるPRでワークフローを改変し、AWS credentialsを窃取される可能性
   - forkからのPRで不正なコードが実行される可能性

## 🎯 改善目標

### 要件定義

1. **mainブランチへのpush時**

   - ✅ CIを実行
   - ✅ CI成功後、手動承認を待機
   - ✅ 承認後にアプリとドキュメントをデプロイ

2. **PR作成時**

   - ✅ CIを実行（既に実装済み）
   - ✅ CI失敗時はマージをブロック（新規実装）

3. **セキュリティ**
   - ✅ ワークフローファイルの編集にレビューを必須化
   - ✅ fork・PRからのシークレットアクセスをブロック
   - ✅ デプロイはmainブランチからのみ許可

## 🔧 改善策

### 1. CI/CDパイプラインの再設計

#### 現在のフロー

```
main push → CI実行（並列）
         → デプロイ実行（並列）
         → ドキュメントデプロイ実行（並列）
```

#### 改善後のフロー

```
main push → CI実行
         → ✅ 手動承認（GitHub Environment）
         → デプロイ実行（CI成功が前提条件）
         → ドキュメントデプロイ実行（CI成功が前提条件）
```

#### 実装方法

**GitHub Environmentsを活用:**

- Environment名: `production`
- Protected reviewers: デプロイ承認者を設定
- Deployment branches: `main` のみ許可

**workflow_runトリガーを使用:**

```yaml
on:
  workflow_run:
    workflows: ['CI']
    types: [completed]
    branches: [main]
```

これにより：

- CIが完了してからのみデプロイワークフローが起動
- CI失敗時はデプロイが実行されない
- 手動承認が必要（Environment設定）

### 2. PRマージ保護の設定

**GitHub Branch Protection Rules（mainブランチ）:**

```yaml
Settings → Branches → Branch protection rules

✓ Require a pull request before merging
  ✓ Require approvals: 1

✓ Require status checks to pass before merging
  ✓ Require branches to be up to date before merging
  ✓ Status checks that are required:
    - test (ci.ymlのジョブ名)

✓ Require conversation resolution before merging

✓ Do not allow bypassing the above settings
```

**結果:**

- CIが通っていないPRはマージ不可能
- レビュー承認が必須
- コメントの解決が必須

### 3. セキュリティ対策

#### 3-1. ワークフロー実行の制限

**脅威モデル:**

- 悪意あるPRでワークフローを改変し、secretsを窃取
- forkからのPRで不正なコード実行

**対策:**

1. **pull_request_targetを使用しない**

   ```yaml
   on:
     pull_request: # ← これを使用（pull_request_targetは危険）
       branches: [main]
   ```

2. **権限を最小化**

   ```yaml
   permissions:
     contents: read # 必要最小限に制限
   ```

3. **workflow_runで分離**
   - シークレットを使用するワークフロー（deploy.yml）は、workflow_runでトリガー
   - PRから直接シークレットにアクセスできないようにする

#### 3-2. CODEOWNERSファイルの作成

`.github/CODEOWNERS` を作成し、ワークフローファイルの変更にレビューを必須化：

```
# GitHub Actions workflows require review
/.github/workflows/ @dev-roar-lab/admins
```

**注意:** リポジトリオーナーまたは管理者チームを指定してください。

#### 3-3. Environmentの保護設定

GitHub Environment (`production`) で以下を設定：

```
✓ Required reviewers: (承認者を指定)
✓ Wait timer: 0 minutes（即座に承認可能）
✓ Deployment branches: Selected branches
  - main のみ許可
```

**効果:**

- forkやPRからのデプロイは完全にブロック
- 承認者のみがデプロイを許可可能

## 📝 実装計画

### Phase 1: 事前準備（GitHub UI設定）

#### Step 1-1: GitHub Environment設定

1. Settings → Environments → "New environment"
2. 名前: `production`
3. "Required reviewers" にデプロイ承認者を追加
4. "Deployment branches" → "Selected branches" → `main` を追加

#### Step 1-2: Branch Protection Rules設定

1. Settings → Branches → "Add branch protection rule"
2. Branch name pattern: `main`
3. 以下を有効化:
   - Require a pull request before merging (approvals: 1)
   - Require status checks to pass before merging
     - Status check: `test`
   - Require conversation resolution before merging

### Phase 2: コード変更

#### Step 2-1: CODEOWNERSファイルの作成

- ファイル: `.github/CODEOWNERS`
- 内容: ワークフローファイルの変更にレビューを必須化

#### Step 2-2: ci.ymlの改善

- 権限を明示的に最小化（`permissions: contents: read`）
- トリガー条件の整理

#### Step 2-3: deploy.ymlの改善

- `workflow_run` トリガーに変更
- Environment保護を追加（`environment: production`）
- CI成功時のみ実行する条件を追加
- ビルドステップを削除（CIからアーティファクトをダウンロード）

#### Step 2-4: deploy-docs.ymlの改善

- `workflow_run` トリガーに変更
- Environment保護を追加（`environment: production`）
- CI成功時のみ実行する条件を追加

#### Step 2-5: ワークフローREADMEの更新

- 新しいフローの説明を追加
- 手動承認の手順を追加
- セキュリティ設定の説明を追加

### Phase 3: 動作確認

#### テストケース

1. **PRのCI実行確認**

   - 新しいブランチでPRを作成
   - CIが自動実行されることを確認
   - デプロイが実行されないことを確認

2. **CIが失敗したPRのマージブロック**

   - 意図的にCIが失敗する変更を加える
   - マージボタンがブロックされることを確認

3. **mainへのマージ後の手動承認フロー**

   - PRをマージ
   - CIが実行されることを確認
   - CI成功後、手動承認プロンプトが表示されることを確認
   - 承認後にデプロイが実行されることを確認

4. **forkからのPRのセキュリティ確認**
   - fork元から悪意あるワークフロー変更のPRを作成（テスト用）
   - CODEOWNERSによりレビューが必須化されることを確認
   - シークレットにアクセスできないことを確認

## ⚠️ 注意事項

### アーティファクト保持期間

- CIで生成したビルドアーティファクトは7日間保持（`ci.yml:52`）
- 7日以上経過したコミットのデプロイは再ビルドが必要

### AWS認証のRole Chaining

- 現在の `deploy.yml` はRole Chainingを使用（`AWS_BRIDGE_ROLE_ARN` → `AWS_EXECUTION_ROLE_ARN`）
- 両方のシークレットがEnvironment設定に存在することを確認

### GitHub Secrets vs Environment Secrets

- Environment (`production`) 固有のシークレットは、Environment設定で管理
- 既存のRepository secretsをEnvironment secretsにコピーまたは移行する必要がある場合がある

### 初回デプロイ

- Environment設定後の初回デプロイでは、手動承認が必須
- 承認者が不在の場合、デプロイがブロックされるため注意

## 📈 期待される効果

### セキュリティの向上

- ✅ ワークフローファイルの不正な変更を防止
- ✅ AWS credentialsの窃取リスクを軽減
- ✅ forkからの不正なコード実行を防止

### デプロイの安全性向上

- ✅ CI失敗時のデプロイを防止
- ✅ 意図しないデプロイを防止（手動承認）
- ✅ デプロイの可視性向上（GitHub UI上で承認フローが確認可能）

### コード品質の向上

- ✅ CIが通っていないコードのマージを防止
- ✅ レビュープロセスの強化

## 🔗 参考資料

- [GitHub Actions - OpenID Connect](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [GitHub - Using environments for deployment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [GitHub - Managing a branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)
- [GitHub - About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub - Security hardening for GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

---

**次のアクション:** Phase 2のコード変更を実装し、Phase 1の設定手順をREADMEに追加します。
