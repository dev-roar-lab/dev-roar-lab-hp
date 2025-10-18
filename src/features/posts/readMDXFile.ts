import fs from 'fs'
import { parseFrontmatter } from '@/features/posts/parseFrontmatter'

export function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}
