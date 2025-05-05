// TODO 要チェック。スターターセットのコード。

import { getMDXFiles } from '@/features/posts/getMDXFiles'
import { readMDXFile } from '@/features/posts/readMDXFile'

import path from 'path'

export function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file))
    const slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content
    }
  })
}
