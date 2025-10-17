import fs from 'fs'
import path from 'path'

export function getMDXFiles(dir: string, locale?: string) {
  const allFiles = fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')

  // ロケールが指定されている場合、そのロケールのファイルのみを返す
  if (locale) {
    return allFiles.filter((file) => file.endsWith(`.${locale}.mdx`))
  }

  return allFiles
}
