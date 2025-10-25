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

### Playwright - Browser Automation

When using Playwright MCP tools for browser automation and testing:

**Headless Mode**: Always run Playwright in headless mode (`headless: true`) for debugging and testing. This ensures consistent behavior and allows running in CI/CD environments.

**Screenshot Storage**: Always save screenshots to the `playwright-screenshots/` directory (relative to repository root) using the `downloadsDir` parameter. PNG files in this directory are automatically ignored by git.

**Cleanup Before Commit**: Before committing changes, always clean up the `playwright-screenshots/` directory to avoid committing temporary test artifacts. The directory itself should be kept (with `.gitkeep`), but all screenshot files should be removed.

Example usage:

```typescript
// Navigate with headless mode
await mcp__playwright__playwright_navigate({
  url: 'http://localhost:3000',
  headless: true
})

// Take screenshot
await mcp__playwright__playwright_screenshot({
  name: 'screenshot-name',
  downloadsDir: './playwright-screenshots',
  savePng: true,
  fullPage: true
})

// Close browser when done
await mcp__playwright__playwright_close()
```

Cleanup command before commit:

```bash
# Remove all screenshots but keep directory
rm playwright-screenshots/*.png
```

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
npm test                 # Run Vitest unit tests
npm run test:ui          # Run tests in UI mode
npm run test:coverage    # Run tests with coverage report
```

### Storybook

```bash
npm run storybook        # Start Storybook dev server on port 6006
npm run build-storybook  # Build Storybook for production
```

### Bundle Analysis

```bash
npm run analyze          # Build with bundle analyzer (generates reports in .next/analyze/)
```

After running `npm run analyze`, the following reports are generated:

- `.next/analyze/client.html` - Client-side bundle analysis
- `.next/analyze/nodejs.html` - Node.js bundle analysis
- `.next/analyze/edge.html` - Edge runtime bundle analysis

Open these HTML files in a browser to visualize bundle composition and identify optimization opportunities.

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

### Directory Structure (Screaming Architecture)

The codebase follows domain-driven design principles:

```
src/
├── app/[locale]/          # Next.js App Router pages (all routes are locale-aware)
│   ├── page.tsx          # Homepage
│   ├── about/            # About page
│   ├── blog/             # Blog pages
│   │   ├── page.tsx      # Blog index page
│   │   └── [slug]/page.tsx  # Individual blog post pages
│   ├── projects/         # Projects pages
│   │   ├── page.tsx      # Projects index page
│   │   └── [slug]/page.tsx  # Individual project pages
│   ├── og/               # Open Graph image generation
│   ├── rss.xml/          # RSS feed generation
│   ├── layout.tsx        # Root layout with i18n provider, fonts, and metadata
│   ├── not-found.tsx     # 404 page
│   └── global.css        # Global styles
├── features/              # Feature-based modules
│   ├── posts/            # Blog post content and utilities
│   │   ├── contents/     # MDX blog posts stored here
│   │   ├── __tests__/    # Unit tests for post utilities
│   │   ├── mdx.tsx       # Custom MDX components (syntax highlighting, headings, links, etc.)
│   │   ├── getBlogPosts.ts  # Main entry point to fetch all posts
│   │   ├── getMDXFiles.ts   # Lists .mdx files in a directory
│   │   ├── readMDXFile.ts   # Reads MDX file and extracts frontmatter
│   │   ├── parseFrontmatter.ts  # Parses YAML frontmatter
│   │   ├── getMDXData.ts    # Combines file reading and metadata extraction
│   │   └── formatDate.ts    # Date formatting utility
│   ├── projects/         # Project content and utilities
│   │   ├── contents/     # MDX project files
│   │   ├── __tests__/    # Unit tests for project utilities
│   │   └── getProjects.ts  # Fetch all projects
│   ├── blog/             # Blog UI components
│   │   └── blogPosts.tsx
│   └── ui/               # Shared UI components
│       ├── nav.tsx       # Navigation component
│       ├── footer.tsx    # Footer component
│       ├── techBadge.tsx # Technology badge component
│       ├── skillBadge.tsx # Skill badge component
│       ├── animations.tsx # Animation utilities
│       └── *.stories.tsx # Storybook stories
├── i18n/                 # i18n configuration
│   ├── routing.ts        # Locale definitions and navigation utilities
│   ├── navigation.ts     # Re-exports navigation utilities
│   └── request.ts        # Server-side i18n utilities
├── lib/                  # Shared libraries
│   └── site.ts          # Site configuration
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

### Git Command Execution

**IMPORTANT**: Execute git commands **one at a time**, not chained with `&&`.

Due to permission requirements, chaining git commands can require user approval for each command in the chain, which disrupts the workflow.

❌ **Don't do this:**

```bash
git add . && git commit -m "message" && git push
```

✅ **Do this instead:**

```bash
# Step 1: Add files
git add .

# Step 2: Commit (after step 1 completes)
git commit -m "message"

# Step 3: Push (after step 2 completes)
git push
```

**Why this matters:**

- Each git command may require separate user approval
- Chained commands block on the first approval request
- Sequential execution provides better visibility of each operation's result
- Easier to handle errors at each step

**Exception**: Commands that are part of a single logical operation can be chained:

```bash
# OK: Single commit operation with heredoc
git commit -m "$(cat <<'EOF'
Multi-line commit message
EOF
)"
```

### Semantic Versioning

This project follows [Semantic Versioning 2.0.0](https://semver.org/).

**Version format**: `MAJOR.MINOR.PATCH` (e.g., `1.0.0`)

| Version   | Description                                                      | Example                                 |
| --------- | ---------------------------------------------------------------- | --------------------------------------- |
| **MAJOR** | Incompatible breaking changes (API changes, major UI redesigns)  | `2.0.0`: Complete UI framework overhaul |
| **MINOR** | Backward-compatible feature additions (new features, components) | `1.1.0`: Add new blog category feature  |
| **PATCH** | Backward-compatible bug fixes (bug fixes, minor improvements)    | `1.0.1`: Fix date display bug           |

**What triggers a version bump**:

✅ **Changes affecting the HP itself**:

- Adding/modifying/removing UI components
- Adding/modifying/removing pages
- Changes affecting build artifacts (`out/`, `docs-site/`)
- User-visible feature additions/changes
- Dependency updates (e.g., React major upgrades)

❌ **Changes that do NOT require version bump**:

- CI/CD script modifications (`.github/workflows/`)
- Development environment configuration (`.vscode/`, `.husky/`)
- Documentation-only updates (`README.md`, `CLAUDE.md`)
- Test code changes/additions only
- Linter or formatter configuration changes

**Version update process**:

1. Update `version` field in `package.json`
2. Commit the changes with appropriate prefix (`feat`, `fix`, etc.)
3. Tag the version: `git tag v1.0.0`
4. Version is automatically reflected in all artifacts on deployment

**Important notes for AI assistants**:

- Always check if changes affect the HP itself before suggesting version updates
- Infrastructure-only changes (CI/CD, CloudFormation) should NOT bump the version
- When adding new features or components, suggest a MINOR version bump
- When fixing bugs, suggest a PATCH version bump
- Only suggest MAJOR version bumps for breaking changes

## Deployment

The site is deployed to AWS S3 + CloudFront using CloudFormation. See `cloudformation/README.md` for detailed deployment instructions.

**Quick deployment:**

1. Build: `npm run build`
2. Upload to S3: `aws s3 sync out/ s3://$BUCKET_NAME/ --delete`
3. Invalidate CloudFront cache: `aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"`

## Testing

This project uses **Vitest** for unit testing with comprehensive test coverage.

### Test Structure

- **Unit Tests**: Located in `__tests__/` directories next to source files
- **Test Files**: 7 test files with 106 test cases (all passing)
- **Coverage**: Target 70% (lines, branches, statements), 75% (functions)
- **Configuration**: `vitest.config.ts` with workspace setup

### Test Coverage Status

Currently tested modules:

- ✅ `parseFrontmatter.ts` - 13 tests
- ✅ `getMDXData.ts` - 13 tests
- ✅ `getBlogPosts.ts` - 16 tests
- ✅ `getProjects.ts` - 16 tests
- ✅ `getMDXFiles.ts` - 11 tests
- ✅ `readMDXFile.ts` - 11 tests
- ✅ `formatDate.ts` - 26 tests

### Storybook Tests

Storybook component tests are currently **disabled** due to compatibility issues between `@storybook/experimental-nextjs-vite@8.6.12` and Next.js 15.5.4. See `vitest.config.ts` for details.

### Running Tests

```bash
npm test              # Run all unit tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Generate coverage report
```

## Key Dependencies

### Core Framework

- **Next.js 15.5.4** with App Router and Turbopack
- **React 19.1.0**
- **TypeScript 5.8.3**

### Styling & UI

- **Tailwind CSS 4.1.4** with PostCSS plugin
- **Geist Font 1.3.1** for typography
- **Framer Motion 12.23.24** for animations
- **React Icons 5.5.0** for icon components

### Content & i18n

- **next-intl 4.1.0** for internationalization
- **next-mdx-remote 5.0.0** for MDX rendering
- **sugar-high 0.9.3** for syntax highlighting

### Development & Testing

- **Vitest 3.1.2** for unit testing
- **Playwright 1.52.0** for browser testing
- **Storybook 8.6.12** for component development
- **ESLint 9.37.0** + **Prettier 3.5.3** for code quality
- **Husky 9.1.7** + **lint-staged 15.5.1** for pre-commit hooks
