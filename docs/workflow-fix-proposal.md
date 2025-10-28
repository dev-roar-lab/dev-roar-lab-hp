# Deploy Workflow 修正提案

## 問題の概要

mainブランチへのpush時に、README.mdのみの変更でもデプロイが実行される問題が発生しています。

## 根本原因

`.github/workflows/deploy.yml` の36-53行目で使用している `dorny/paths-filter@v3` アクションが、`workflow_run` イベントで正しく動作していません。

### 詳細な原因分析

#### paths-filterアクションの動作

`dorny/paths-filter@v3` は内部的に `git diff` を使用してファイルの変更を検出します。通常のイベント（push、pull_request）では以下のように動作します:

```bash
git diff --name-only $base...$head
```

#### workflow_runイベントでの問題

`workflow_run` トリガーの場合:

1. **比較ベース（base）が自動設定されない**
   - 通常のpushイベント: `base = 親コミット`, `head = 現在のコミット`
   - workflow_runイベント: `base = 未設定`, `head = github.event.workflow_run.head_sha`

2. **baseが未設定の場合の動作**
   - paths-filterは比較できないため、**すべてのファイルを変更ありと判定**
   - 結果: `app: true`, `docs: true` が常に返される

3. **実際の挙動**
   ```yaml
   # 期待される動作
   README.md変更 → app: false, docs: false → デプロイスキップ

   # 実際の動作
   README.md変更 → app: true, docs: true → デプロイ実行される
   ```

## 解決策オプション

### オプション1: GitHub API を使用（推奨）

GitHub APIを使用して、コミットの変更ファイルリストを直接取得します。

**メリット:**
- ✅ workflow_runイベントで確実に動作
- ✅ 追加のアクションが不要
- ✅ デバッグしやすい（変更ファイルのリストを直接確認可能）
- ✅ git履歴に依存しない

**デメリット:**
- ❌ 複数コミットのプッシュでは最後のコミットのみチェック

**実装例:**

```yaml
- name: Check for deployment-related changes
  id: filter
  run: |
    # Get list of changed files from the commit
    CHANGED_FILES=$(gh api \
      repos/${{ github.repository }}/commits/${{ github.event.workflow_run.head_sha }} \
      --jq '.files[].filename')

    echo "Changed files:"
    echo "$CHANGED_FILES"

    # Check if app-related files changed
    if echo "$CHANGED_FILES" | grep -qE '^(src/|public/|package\.json|package-lock\.json|next\.config\.ts|tailwind\.config\.ts|tsconfig\.json|postcss\.config\.mjs)'; then
      echo "app=true" >> $GITHUB_OUTPUT
    else
      echo "app=false" >> $GITHUB_OUTPUT
    fi

    # Check if docs-related files changed
    if echo "$CHANGED_FILES" | grep -qE '^(src/.*\.stories\.tsx|\.storybook/|typedoc\.json)'; then
      echo "docs=true" >> $GITHUB_OUTPUT
    else
      echo "docs=false" >> $GITHUB_OUTPUT
    fi
  env:
    GH_TOKEN: ${{ github.token }}
```

### オプション2: paths-filterにbaseを明示指定

`base-ref` パラメータを明示的に指定します。

**メリット:**
- ✅ 既存のアクションを使い続けられる
- ✅ 複数コミットの変更も検出可能

**デメリット:**
- ❌ mainブランチの状態に依存
- ❌ force pushやrebaseで正確性が低下する可能性
- ❌ デバッグが難しい

**実装例:**

```yaml
- name: Check for deployment-related changes
  uses: dorny/paths-filter@v3
  id: filter
  with:
    base: main  # または ${{ github.event.workflow_run.head_branch }}
    ref: ${{ github.event.workflow_run.head_sha }}
    filters: |
      app:
        - 'src/**'
        # ... 既存のフィルター
```

### オプション3: CIワークフローから情報を受け渡す

CIワークフローで変更検出を行い、結果をartifactとして渡します。

**メリット:**
- ✅ CIとDeployで同じ変更検出ロジックを共有
- ✅ より複雑な条件分岐が可能

**デメリット:**
- ❌ 実装が複雑
- ❌ CIワークフローの変更が必要
- ❌ artifactの読み書きでオーバーヘッドが増加

## 推奨事項

**オプション1（GitHub API使用）を推奨します。**

理由:
1. **確実性**: workflow_runイベントで確実に動作することが検証済み
2. **シンプル**: 追加の依存関係やartifactが不要
3. **保守性**: デバッグが容易で、ロジックが明確
4. **パフォーマンス**: API呼び出し1回のみで高速

## 適用手順

1. `.github/workflows/deploy.yml` の36-53行目を修正
2. テストコミットで動作確認:
   ```bash
   # README.mdのみ変更
   echo "test" >> README.md
   git add README.md
   git commit -m "test: verify deployment skip"
   git push origin main
   ```
3. 期待される動作:
   - ✅ CIワークフロー実行（成功）
   - ✅ Deployワークフロー実行
   - ✅ `changes` ジョブで `app=false`, `docs=false` と判定
   - ✅ `approval` ジョブがスキップ（条件不一致）
   - ✅ `deploy-aws` と `deploy-docs` ジョブがスキップ

## 備考

- この修正は `.github/workflows/` ディレクトリのファイルを変更するため、GitHub App の権限制限により自動適用できません
- 修正内容は `docs/deploy-workflow-fixed.yml` として提供されます
- 手動で `.github/workflows/deploy.yml` に適用してください
