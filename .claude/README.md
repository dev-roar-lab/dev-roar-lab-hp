# Claude Code Settings

このディレクトリには、Claude Codeの権限設定が含まれています。

## ファイル

- `settings.json` - プロジェクト共有の権限設定（リポジトリにコミット）
- `settings.local.json` - 個人用の権限設定（gitignore済み、コミットされません）

## 権限設定の内容

### 許可されている操作

- **ファイル読み取り**: `Read`, `Glob`, `Grep`
- **npmコマンド**: すべてのnpmスクリプト
- **gitコマンド**: すべてのgit操作
- **ファイル編集/作成**:
  - TypeScript/TSX (`.ts`, `.tsx`)
  - JSON (`.json`)
  - Markdown (`.md`)
  - MDX (`.mdx`)

### 拒否されている操作

- システム破壊的コマンド (`rm -rf /`, `dd`, `mkfs` など)
- システム設定ファイルの編集 (`~/.ssh/*`, `/etc/*`)

## カスタマイズ

個人的な設定を追加する場合は、`.claude/settings.local.json`を作成してください。
このファイルは自動的に`.gitignore`されます。

詳細: https://docs.claude.com/ja/docs/claude-code/iam
