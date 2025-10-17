import path from 'path'
import { getMDXData } from '@/features/posts/getMDXData'

export function getProjects(locale?: string) {
  return getMDXData(path.join(process.cwd(), 'src', 'features', 'projects', 'contents'), locale)
}
