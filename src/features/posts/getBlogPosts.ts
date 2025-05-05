// TODO 要チェック。スターターセットのコード。

import { getMDXData } from '@/features/posts/getMDXData'
import path from 'path'

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'src', 'features', 'posts', 'contents'))
}
