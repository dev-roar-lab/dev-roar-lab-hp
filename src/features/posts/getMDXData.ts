import { getMDXFiles } from '@/features/posts/getMDXFiles'
import { readMDXFile } from '@/features/posts/readMDXFile'

import path from 'path'

export function getMDXData(dir: string, locale?: string) {
  const mdxFiles = getMDXFiles(dir, locale)
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file))
    // ファイル名から slug を抽出（例: static-typing.ja.mdx → static-typing）
    const fileName = path.basename(file, path.extname(file))
    const slug = locale ? fileName.replace(`.${locale}`, '') : fileName

    return {
      metadata,
      slug,
      content
    }
  })
}
