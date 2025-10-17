import { getMDXData } from '@/features/posts/getMDXData'
import path from 'path'

export function getBlogPosts(locale?: string) {
  return getMDXData(path.join(process.cwd(), 'src', 'features', 'posts', 'contents'), locale)
}
