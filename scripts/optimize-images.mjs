#!/usr/bin/env node

/**
 * Image Optimization Script
 *
 * This script optimizes images in the public/images directory by:
 * 1. Converting PNG/JPG to WebP and AVIF formats
 * 2. Maintaining original images as fallback
 * 3. Generating optimized versions with reduced file sizes
 *
 * Usage:
 *   npm run optimize-images
 */

import sharp from 'sharp'
import { readdir, stat, mkdir } from 'fs/promises'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuration
const CONFIG = {
  inputDir: join(__dirname, '../public/images'),
  outputDir: join(__dirname, '../public/images'),
  formats: ['webp', 'avif'],
  quality: {
    webp: 85,
    avif: 80,
    jpeg: 85,
    png: 90
  },
  supportedExtensions: ['.png', '.jpg', '.jpeg']
}

/**
 * Get all image files recursively from a directory
 * Skips already optimized files (.webp, .avif) and -optimized variants
 */
async function getImageFiles(dir) {
  const files = []

  try {
    const entries = await readdir(dir)

    for (const entry of entries) {
      const fullPath = join(dir, entry)
      const stats = await stat(fullPath)

      if (stats.isDirectory()) {
        // Recursively get files from subdirectories
        const subFiles = await getImageFiles(fullPath)
        files.push(...subFiles)
      } else if (stats.isFile()) {
        const ext = extname(entry).toLowerCase()
        const baseName = basename(entry, ext)

        // Skip already optimized files
        if (ext === '.webp' || ext === '.avif') {
          continue
        }

        // Skip -optimized variants
        if (baseName.includes('-optimized')) {
          continue
        }

        if (CONFIG.supportedExtensions.includes(ext)) {
          files.push(fullPath)
        }
      }
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`📁 Creating directory: ${dir}`)
      await mkdir(dir, { recursive: true })
    } else {
      throw error
    }
  }

  return files
}

/**
 * Get file size in KB
 */
async function getFileSize(filePath) {
  try {
    const stats = await stat(filePath)
    return (stats.size / 1024).toFixed(2)
  } catch {
    return null
  }
}

/**
 * Optimize a single image file
 */
async function optimizeImage(inputPath) {
  const ext = extname(inputPath).toLowerCase()
  const baseName = basename(inputPath, ext)
  const dirName = dirname(inputPath)

  console.log(`\n🖼️  Processing: ${basename(inputPath)}`)

  const originalSize = await getFileSize(inputPath)
  console.log(`   Original: ${originalSize} KB`)

  const results = []

  // Generate WebP
  if (CONFIG.formats.includes('webp')) {
    const webpPath = join(dirName, `${baseName}.webp`)

    try {
      await sharp(inputPath).webp({ quality: CONFIG.quality.webp }).toFile(webpPath)

      const webpSize = await getFileSize(webpPath)
      const savings = ((1 - webpSize / originalSize) * 100).toFixed(1)
      console.log(`   ✓ WebP: ${webpSize} KB (${savings}% smaller)`)
      results.push({ format: 'webp', size: webpSize, savings })
    } catch (error) {
      console.error(`   ✗ WebP failed: ${error.message}`)
    }
  }

  // Generate AVIF
  if (CONFIG.formats.includes('avif')) {
    const avifPath = join(dirName, `${baseName}.avif`)

    try {
      await sharp(inputPath).avif({ quality: CONFIG.quality.avif }).toFile(avifPath)

      const avifSize = await getFileSize(avifPath)
      const savings = ((1 - avifSize / originalSize) * 100).toFixed(1)
      console.log(`   ✓ AVIF: ${avifSize} KB (${savings}% smaller)`)
      results.push({ format: 'avif', size: avifSize, savings })
    } catch (error) {
      console.error(`   ✗ AVIF failed: ${error.message}`)
    }
  }

  return results
}

/**
 * Main optimization function
 */
async function main() {
  console.log('🚀 Starting image optimization...\n')
  console.log(`📂 Input directory: ${CONFIG.inputDir}`)
  console.log(`📂 Output directory: ${CONFIG.outputDir}`)
  console.log(`🎨 Formats: ${CONFIG.formats.join(', ')}\n`)

  const imageFiles = await getImageFiles(CONFIG.inputDir)

  if (imageFiles.length === 0) {
    console.log('⚠️  No images found to optimize')
    return
  }

  console.log(`📊 Found ${imageFiles.length} image(s) to optimize`)

  const allResults = []

  for (const imagePath of imageFiles) {
    const results = await optimizeImage(imagePath)
    allResults.push(...results)
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('✅ Optimization Complete!')
  console.log('='.repeat(60))
  console.log(`📈 Total images processed: ${imageFiles.length}`)
  console.log(`💾 Total formats generated: ${allResults.length}`)

  if (allResults.length > 0) {
    const avgSavings = (allResults.reduce((sum, r) => sum + parseFloat(r.savings), 0) / allResults.length).toFixed(1)
    console.log(`📉 Average size reduction: ${avgSavings}%`)
  }

  console.log('\n💡 Tip: Update your MDX files to use WebP/AVIF with PNG fallback:')
  console.log('   <picture>')
  console.log('     <source srcSet="/images/example.avif" type="image/avif" />')
  console.log('     <source srcSet="/images/example.webp" type="image/webp" />')
  console.log('     <img src="/images/example.png" alt="Description" />')
  console.log('   </picture>\n')
}

main().catch(console.error)
