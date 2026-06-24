/**
 * 文件分片上传服务器
 * 
 * 功能：
 * 1. 接收文件分片并存储
 * 2. 记录已上传的分片（用于断点续传）
 * 3. 合并所有分片成完整文件
 * 4. 检查文件是否已存在（用于秒传）
 */

import express from 'express'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

// ==================== 中间件配置 ====================

// 跨域支持
app.use(cors())

// 解析 JSON 请求体
app.use(express.json())

// 配置 multer（使用内存存储，避免 req.body 解析问题）
const upload = multer({ storage: multer.memoryStorage() })

// ==================== 数据存储 ====================

// 记录已上传的分片（生产环境应使用数据库）
const uploadedChunks = new Map()  // key: fileHash, value: Set<chunkIndex>

// 记录完整文件（用于秒传）
const completedFiles = new Map()  // key: fileHash, value: filename

// ==================== API 接口 ====================

/**
 * 接口1：检查已上传的分片
 * 
 * 用途：断点续传
 * - 前端询问服务器哪些分片已上传
 * - 返回已上传分片的索引数组
 */
app.post('/check', (req, res) => {
  const { fileHash, filename, totalChunks } = req.body

  console.log(`检查文件: ${filename}, hash: ${fileHash}`)

  // 检查文件是否已完整上传（秒传）
  if (completedFiles.has(fileHash)) {
    return res.json({
      exists: true,
      uploadedChunks: Array.from({ length: totalChunks }, (_, i) => i)
    })
  }

  // 返回已上传的分片索引
  const uploaded = uploadedChunks.get(fileHash) || new Set()

  res.json({
    exists: false,
    uploadedChunks: Array.from(uploaded)
  })
})

/**
 * 接口2：上传分片
 * 
 * 用途：接收单个文件分片
 * - 存储分片到临时目录
 * - 记录分片索引（用于断点续传）
 */
app.post('/upload', upload.single('chunk'), (req, res) => {
  const { fileHash, chunkIndex, filename } = req.body

  console.log(`接收分片: ${filename} - 分片 ${chunkIndex}`)

  // 创建分片目录
  const chunkDir = path.join(__dirname, 'chunks')
  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir, { recursive: true })
  }

  // 保存分片文件
  const chunkPath = path.join(chunkDir, `${fileHash}-${chunkIndex}`)
  fs.writeFileSync(chunkPath, req.file.buffer)

  // 记录已上传的分片
  if (!uploadedChunks.has(fileHash)) {
    uploadedChunks.set(fileHash, new Set())
  }
  uploadedChunks.get(fileHash).add(parseInt(chunkIndex))

  res.json({
    success: true,
    message: `分片 ${chunkIndex} 上传成功`
  })
})

/**
 * 接口3：合并分片
 * 
 * 用途：将所有分片合并成完整文件
 * - 按顺序读取所有分片
 * - 写入到最终文件
 * - 删除临时分片
 */
app.post('/merge', async (req, res) => {
  const { fileHash, filename, totalChunks } = req.body

  console.log(`合并文件: ${filename}, 共 ${totalChunks} 个分片`)

  try {
    // 创建上传目录
    const uploadDir = path.join(__dirname, 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, filename)

    // 创建写入流
    const writeStream = fs.createWriteStream(filePath)

    // 按顺序读取并合并分片
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(__dirname, 'chunks', `${fileHash}-${i}`)

      // 检查分片是否存在
      if (!fs.existsSync(chunkPath)) {
        throw new Error(`分片 ${i} 不存在`)
      }

      // 读取分片数据
      const chunkData = fs.readFileSync(chunkPath)

      // 写入到最终文件
      writeStream.write(chunkData)

      // 删除临时分片
      fs.unlinkSync(chunkPath)
    }

    writeStream.end()

    // 记录完整文件
    completedFiles.set(fileHash, filename)

    // 清理分片记录
    uploadedChunks.delete(fileHash)

    console.log(`文件合并完成: ${filename}`)

    res.json({
      success: true,
      message: '文件合并成功',
      path: filePath
    })

  } catch (error) {
    console.error('合并失败:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * 接口4：获取已上传文件列表
 */
app.get('/files', (req, res) => {
  const uploadDir = path.join(__dirname, 'uploads')

  if (!fs.existsSync(uploadDir)) {
    return res.json({ files: [] })
  }

  const files = fs.readdirSync(uploadDir).map(filename => {
    const filePath = path.join(uploadDir, filename)
    const stats = fs.statSync(filePath)

    return {
      name: filename,
      size: stats.size,
      uploadTime: stats.mtime
    }
  })

  res.json({ files })
})

// ==================== 启动服务器 ====================

app.listen(PORT, () => {
  console.log(`\n🚀 文件上传服务器已启动！`)
  console.log(`📍 地址: http://localhost:${PORT}`)
  console.log(`📁 上传目录: ${path.join(__dirname, 'uploads')}`)
  console.log(`\n等待文件上传...\n`)
})
