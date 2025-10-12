# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run verify-format` - Check code formatting with Prettier
- `npm run ci` - Run full CI pipeline (format check, lint, build) sequentially

### Storybook
- `npm run storybook` - Start Storybook dev server on port 6006
- `npm run build-storybook` - Build Storybook for production

### Testing
Tests are configured via Vitest with Storybook integration. Tests run in browser mode using Playwright with Chromium.

## Architecture Overview

### Internationalization (i18n)
This is a **multilingual Next.js application** using next-intl with locale-based routing:
- **Locales**: `en`, `ja` (default locale is `ja`)
- **Known Issue**: Default locale doesn't properly default to `ja` (see TODO in `src/i18n/routing.ts:5`)
- **Route Structure**: All pages are under `/[locale]/` dynamic segment
- **Locale Messages**: Located in `public/locales/{locale}/messages.json`
- **i18n Config**: `src/i18n/routing.ts` defines locales, `src/i18n/request.ts` handles request-level locale resolution

### Directory Structure (Screaming Architecture)
The project follows [screaming architecture](https://dev.to/profydev/screaming-architecture-evolution-of-a-react-folder-structure-4g25) principles with feature-based organization:

#### `src/app/[locale]/`
Next.js App Router with locale-based routing. All routes are internationalized.

#### `src/features/`
Feature modules organized by domain:
- **`posts/`**: MDX blog post functionality
  - Fine-grained functions for MDX operations (getMDXFiles, readMDXFile, parseFrontmatter, getMDXData, getBlogPosts)
  - `mdx.tsx`: Custom MDX components with syntax highlighting (sugar-high), custom links, images, and auto-generated heading anchors
  - `contents/`: MDX blog post files
- **`blog/`**: Blog UI components
- **`ui/`**: Shared UI components (nav, footer)

#### `src/i18n/`
Internationalization configuration and utilities for next-intl

#### `src/stories/`
Storybook stories for component documentation

### Key Technical Details

#### MDX Content System
- Blog posts are stored as MDX files in `src/features/posts/contents/`
- The MDX system uses function-level granularity (each operation is a separate module)
- Custom MDX components include syntax highlighting, custom links (internal/external detection), and auto-generated heading anchors
- Uses `next-mdx-remote` for MDX rendering and `sugar-high` for syntax highlighting

#### Styling
- **Tailwind CSS v4** with PostCSS
- **Geist fonts** (Sans and Mono) from Vercel
- Dark mode support via Tailwind's dark mode classes

#### Analytics
- Vercel Analytics and Speed Insights are integrated in the root layout

#### Static Export (Disabled)
The `output: 'export'` option in `next.config.ts` is commented out, indicating the app uses Next.js server features

## Git Commit Convention

Commits follow this format:
```
{prefix}: 概要 (#{issue number})

詳細なコミットメッセージが必要な場合は1行あけてから書いてください。
```

**Prefixes:**
- `feat`: 新機能 (new feature)
- `fix`: バグ修正 (bug fix)
- `docs`: ドキュメント変更 (documentation)
- `refactor`: リファクタリング (refactoring)
- `style`: フォーマット修正（動作変更なし） (formatting, no behavior change)
- `test`: テスト追加・修正 (test changes)
- `chore`: ビルド・CI/CD など (build/CI/CD)

## Pre-commit Hooks
Husky is configured with pre-commit hooks that run `lint-staged`. Ensure code passes formatting and linting before committing.
