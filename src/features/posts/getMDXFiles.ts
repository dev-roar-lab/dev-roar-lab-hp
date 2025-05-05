// TODO 要チェック。スターターセットのコード。

import fs from 'fs'
import path from 'path'

export function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}
