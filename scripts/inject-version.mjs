#!/usr/bin/env node

/**
 * ドキュメントHTMLファイルにpackage.jsonのバージョンを埋め込むスクリプト
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// package.jsonからバージョンを読み込む
const packageJsonPath = path.join(__dirname, '..', 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
const version = packageJson.version

// HTMLファイルのパス
const htmlPath = path.join(__dirname, '..', 'docs-site', 'index.html')

// HTMLファイルが存在するか確認
if (!fs.existsSync(htmlPath)) {
  console.log('⚠️  ドキュメントHTMLファイルがまだ生成されていません。')
  console.log('   先に npm run docs:build を実行してください。')
  process.exit(0)
}

// HTMLファイルを読み込む
let html = fs.readFileSync(htmlPath, 'utf-8')

// __VERSION__プレースホルダーをバージョンに置き換える
html = html.replace(/__VERSION__/g, version)

// HTMLファイルに書き込む
fs.writeFileSync(htmlPath, html, 'utf-8')

console.log(`✅ バージョン ${version} をドキュメントHTMLに埋め込みました。`)
