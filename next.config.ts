import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import packageJson from './package.json'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  // パフォーマンス最適化
  poweredByHeader: false, // X-Powered-By ヘッダーを無効化（セキュリティ向上）
  compress: true, // gzip圧縮を有効化
  // 静的エクスポート用のトレーリングスラッシュ設定
  trailingSlash: true,
  // 環境変数にバージョンを注入
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version
  }
}

export default withNextIntl(nextConfig)
