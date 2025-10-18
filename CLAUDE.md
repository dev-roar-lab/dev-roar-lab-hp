# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MCP Tool Usage Guidelines

### Code Search - Use Serena MCP

When searching or analyzing source code in this repository, **ALWAYS use the Serena MCP tools** (`mcp__serena__*`):

- `mcp__serena__find_symbol` - Find classes, functions, methods by name
- `mcp__serena__search_for_pattern` - Search for code patterns with regex
- `mcp__serena__get_symbols_overview` - Get overview of symbols in a file
- `mcp__serena__find_referencing_symbols` - Find references to a symbol
- `mcp__serena__list_dir` - List directory contents
- `mcp__serena__find_file` - Find files by name pattern

**Do NOT use** basic tools like `Grep`, `Glob`, or `Read` for code exploration. Serena provides semantic code understanding and is more efficient.

### AWS Knowledge - Use AWS Knowledge MCP

When researching AWS services, APIs, or CloudFormation resources, **use the AWS Knowledge MCP tools** (`mcp__aws-knowlege__*`):

- `mcp__aws-knowlege__aws___search_documentation` - Search AWS documentation
- `mcp__aws-knowlege__aws___read_documentation` - Read specific AWS docs pages
- `mcp__aws-knowlege__aws___get_regional_availability` - Check AWS service availability by region
- `mcp__aws-knowlege__aws___recommend` - Get related AWS documentation
- `mcp__aws-knowlege__aws___list_regions` - List all AWS regions

Use these tools when:

- Verifying AWS API specifications
- Checking CloudFormation resource properties
- Understanding AWS service capabilities
- Planning multi-region deployments

## Development Commands

### Core Development

```bash
npm run dev              # Start development server with Turbopack (cache disabled)
npm run dev:clean        # Clean .next cache and start dev server (use when cache issues occur)
npm run build            # Build for production (outputs to out/ directory)
npm start                # Start production server
npm run lint             # Run ESLint
npm run verify-format    # Check code formatting with Prettier
npm run ci               # Run full CI pipeline (format → lint → build)
```

### Testing

```bash
npm test                 # Run Vitest with Playwright browser mode (tests Storybook stories)
```

### Storybook

```bash
npm run storybook        # Start Storybook dev server on port 6006
npm run build-storybook  # Build Storybook for production
```

### Deployment (AWS S3 + CloudFront)

```bash
# Build and deploy to AWS (see cloudformation/README.md for setup)
npm run build            # Build static export
aws s3 sync out/ s3://$BUCKET_NAME/ --delete
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
```

## Architecture Overview

### Static Site Generation (SSG)

This is a **statically exported Next.js application** (`output: 'export'` in next.config.ts). All pages are pre-rendered at build time and deployed to S3 + CloudFront. No server-side rendering or API routes are used.

### Internationalization (i18n)

- **Framework**: next-intl with middleware-based locale detection
- **Locales**: `ja` (default), `en`
- **Routing**: All pages are under `/[locale]/` dynamic segment (e.g., `/ja/blog`, `/en/blog`)
- **Translation files**: `public/locales/{locale}/messages.json`
- **Configuration**: `src/i18n/routing.ts` defines locales and creates navigation utilities
- **Middleware**: `src/middleware.ts` handles locale detection and redirects
- **Known issue**: There's a TODO in `src/i18n/routing.ts:6` about default locale not working as expected

### Directory Structure (Screaming Architecture)

The codebase follows domain-driven design principles:

```
src/
├── app/[locale]/          # Next.js App Router pages (all routes are locale-aware)
│   ├── page.tsx          # Homepage
│   ├── blog/page.tsx     # Blog index page
│   ├── blog/[slug]/page.tsx  # Individual blog post pages
│   └── layout.tsx        # Root layout with i18n provider, fonts, and metadata
├── features/              # Feature-based modules
│   ├── posts/            # Blog post content and utilities
│   │   ├── contents/     # MDX blog posts stored here
│   │   ├── mdx.tsx       # Custom MDX components (syntax highlighting, headings, links, etc.)
│   │   ├── getBlogPosts.ts  # Main entry point to fetch all posts
│   │   ├── getMDXFiles.ts   # Lists .mdx files in a directory
│   │   ├── readMDXFile.ts   # Reads MDX file and extracts frontmatter
│   │   ├── parseFrontmatter.ts  # Parses YAML frontmatter
│   │   ├── getMDXData.ts    # Combines file reading and metadata extraction
│   │   └── formatDate.ts    # Date formatting utility
│   ├── blog/             # Blog UI components
│   └── ui/               # Shared UI components (nav, footer)
├── i18n/                 # i18n configuration
│   ├── routing.ts        # Locale definitions and navigation utilities
│   ├── navigation.ts     # Re-exports navigation utilities
│   └── request.ts        # Server-side i18n utilities
└── middleware.ts         # next-intl middleware for locale handling
```

### MDX Blog System

The blog uses a **granular function design** for maximum flexibility:

1. **`getMDXFiles(dir)`** - Returns array of .mdx file names in directory
2. **`readMDXFile(filepath)`** - Reads file and returns `{ metadata, content }`
3. **`parseFrontmatter(fileContent)`** - Extracts YAML frontmatter from MDX string
4. **`getMDXData(dir)`** - Combines above functions to return array of `{ metadata, slug, content }`
5. **`getBlogPosts()`** - Entry point that calls `getMDXData()` with posts directory path

This design allows importing and composing individual functions as needed, rather than a monolithic API.

**Custom MDX Components** (`src/features/posts/mdx.tsx`):

- `Code` - Syntax highlighting using sugar-high
- `createHeading` - Auto-generates anchor links for headings with slugified IDs
- `CustomLink` - External links open in new tab
- `RoundedImage` - Styled image wrapper
- `Table` - Custom table styling

### Styling System

- **Tailwind CSS v4** with `@tailwindcss/postcss` plugin
- **Geist Font** (Sans & Mono) loaded via `geist/font` package
- Global styles in `src/app/[locale]/global.css`
- Dark mode support via `dark:` utility classes

### Static Export Configuration

- `next.config.ts` sets `output: 'export'` for static site generation
- `images.unoptimized: true` because Image Optimization API isn't available in static export
- Build output goes to `out/` directory
- All routes must be statically generated via `generateStaticParams()`

## Code Patterns

### Async Server Components

All page components and layouts use async/await patterns:

```typescript
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  // ...
}
```

### Locale Handling

Always destructure `locale` from params in route components:

```typescript
const { locale } = await params
if (!hasLocale(routing.locales, locale)) {
  notFound()
}
```

### Navigation

Use the custom navigation utilities from `@/i18n/routing` instead of Next.js defaults:

```typescript
import { Link, redirect, usePathname, useRouter } from '@/i18n/routing'
```

### Translation Usage

Use `next-intl`'s `useTranslations` hook in client components:

```typescript
import { useTranslations } from 'next-intl'
const t = useTranslations('SomeKey')
```

## Git Workflow

### Commit Message Format

```
{prefix}: Summary

Optional detailed description after blank line.
```

**Prefixes:**

- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation changes
- `refactor` - Code refactoring
- `style` - Formatting changes (no behavior change)
- `test` - Test additions or modifications
- `chore` - Build, CI/CD, dependencies

### Pre-commit Hooks

Husky + lint-staged automatically run on commit:

- ESLint with `--fix` on `.{ts,tsx,js,jsx,cjs,mjs,md}` files
- Prettier with `--write` on code and config files

## Deployment

The site is deployed to AWS S3 + CloudFront using CloudFormation. See `cloudformation/README.md` for detailed deployment instructions.

**Quick deployment:**

1. Build: `npm run build`
2. Upload to S3: `aws s3 sync out/ s3://$BUCKET_NAME/ --delete`
3. Invalidate CloudFront cache: `aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"`

## Testing

Tests are written for Storybook stories using Vitest + Playwright browser mode. The test configuration is in `vitest.config.ts` and runs against components defined in `.storybook/`.

## Key Dependencies

- **Next.js 15** with App Router and Turbopack
- **React 19**
- **next-intl 4.1** for i18n
- **next-mdx-remote 5.0** for MDX rendering
- **sugar-high** for syntax highlighting
- **Tailwind CSS v4**
- **Vitest + Playwright** for testing
