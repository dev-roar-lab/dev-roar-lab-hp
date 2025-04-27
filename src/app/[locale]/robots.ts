import { baseUrl } from '@/app/[locale]/sitemap'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*'
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  }
}
