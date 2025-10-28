# デプロイワークフロー修正提案

## 問題の概要

mainブランチへのpush時に、README.mdのみの変更でもデプロイが発生してしまう問題。

## 原因分析

`.github/workflows/deploy.yml`の`changes`ジョブで使用している`dorny/paths-filter@v3`アクションが、`workflow_run`トリガーの際に変更ファイルを正しく検出できていない。

### 具体的な問題点

1. **baseパラメータが未指定**: `workflow_run`イベントでは、`paths-filter`アクションにデフォルトの比較ベースが設定されていないため、すべてのファイルが変更されたと判定される

2. **workflow_runの特性**: `workflow_run`トリガーは別のワークフローの完了をトリガーとするため、通常のpushイベントとは異なるコンテキストで実行される

## 解決策

### オプション1: 前回のコミットとの差分を取得（推奨）

```yaml
- name: Check for deployment-related changes
  uses: dorny/paths-filter@v3
  id: filter
  with:
    # workflow_runイベントでは、トリガーされたコミットの直前のコミットと比較
    base: ${{ github.event.workflow_run.head_sha }}~1
    ref: ${{ github.event.workflow_run.head_sha }}
    filters: |
      app:
        - 'src/**'
        - 'public/**'
        - 'package.json'
        - 'package-lock.json'
        - 'next.config.ts'
        - 'tailwind.config.ts'
        - 'tsconfig.json'
        - 'postcss.config.mjs'
      docs:
        - 'src/**/*.stories.tsx'
        - '.storybook/**'
        - 'typedoc.json'
```

### オプション2: mainブランチとの差分を取得

```yaml
- name: Check for deployment-related changes
  uses: dorny/paths-filter@v3
  id: filter
  with:
    # mainブランチの最新と比較
    base: main
    ref: ${{ github.event.workflow_run.head_sha }}
    filters: |
      # ... 同上
```

### オプション3: GitHub APIを使用した変更検出（最も確実）

`paths-filter`の代わりに、GitHub CLIを使用して変更ファイルを直接取得する方法：

```yaml
- name: Check for deployment-related changes
  id: filter
  run: |
    # 変更されたファイルのリストを取得
    CHANGED_FILES=$(gh api \
      repos/${{ github.repository }}/commits/${{ github.event.workflow_run.head_sha }} \
      --jq '.files[].filename')

    echo "Changed files:"
    echo "$CHANGED_FILES"

    # appに関連するファイルが変更されたかチェック
    if echo "$CHANGED_FILES" | grep -qE '^(src/|public/|package\.json|package-lock\.json|next\.config\.ts|tailwind\.config\.ts|tsconfig\.json|postcss\.config\.mjs)'; then
      echo "app=true" >> $GITHUB_OUTPUT
    else
      echo "app=false" >> $GITHUB_OUTPUT
    fi

    # docsに関連するファイルが変更されたかチェック
    if echo "$CHANGED_FILES" | grep -qE '^(src/.*\.stories\.tsx|\.storybook/|typedoc\.json)'; then
      echo "docs=true" >> $GITHUB_OUTPUT
    else
      echo "docs=false" >> $GITHUB_OUTPUT
    fi
  env:
    GH_TOKEN: ${{ github.token }}
```

## 推奨する修正

**オプション3（GitHub API使用）が最も確実**です。理由：

1. ✅ `workflow_run`イベントでも確実に動作
2. ✅ 追加のアクションやセットアップが不要
3. ✅ GitHub標準のAPIを使用するため、将来的な互換性が高い
4. ✅ デバッグしやすい（変更ファイルのリストを直接確認可能）

## 適用方法

1. `.github/workflows/deploy.yml`の36-53行目を上記のオプション3のコードで置き換える
2. 変更をコミット・プッシュ
3. README.mdのみの変更でテスト：
   ```bash
   echo "test" >> README.md
   git add README.md
   git commit -m "test: verify deployment skip"
   git push origin main
   ```
4. CIワークフローが成功しても、deployワークフローの`changes`ジョブで`app=false`、`docs=false`となり、デプロイがスキップされることを確認

## 検証項目

- [ ] README.mdのみの変更でデプロイがスキップされる
- [ ] src/配下の変更でAWSデプロイが実行される
- [ ] .storybook/配下の変更でドキュメントデプロイが実行される
- [ ] package.jsonの変更でAWSデプロイが実行される
- [ ] workflow_dispatchでの手動実行時は常にデプロイされる
