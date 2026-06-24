<script setup lang="ts">
import { ref, computed } from 'vue'

/**
 * 文件分片上传 + 断点续传 Demo
 * 
 * 核心原理：
 * 1. 分片上传：将大文件切割成多个小块，逐个上传
 * 2. 断点续传：记录已上传的分片，中断后可继续上传未完成的分片
 * 3. 秒传：通过文件唯一标识判断服务器是否已存在该文件
 */

// ==================== 类型定义 ====================
interface FileChunk {
  index: number          // 分片索引
  start: number          // 起始字节
  end: number            // 结束字节
  chunk: Blob            // 分片数据
  uploaded: boolean      // 是否已上传
}

interface UploadProgress {
  filename: string
  fileSize: number
  totalChunks: number
  uploadedChunks: number
  progress: number
  status: 'pending' | 'uploading' | 'paused' | 'completed' | 'error'
}

// ==================== 配置 ====================
const CHUNK_SIZE = 1024 * 1024 * 2  // 每个分片 2MB
const SERVER_URL = 'http://localhost:3000'  // 后端服务器地址

// ==================== 响应式数据 ====================
const fileInput = ref<HTMLInputElement>()
const currentFile = ref<File | null>(null)
const chunks = ref<FileChunk[]>([])
const uploadProgress = ref<UploadProgress | null>(null)
const isUploading = ref(false)
const uploadList = ref<UploadProgress[]>([])

// ==================== 核心功能函数 ====================

/**
 * 选择文件
 */
function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  
  currentFile.value = file
  
  // 初始化上传进度
  uploadProgress.value = {
    filename: file.name,
    fileSize: file.size,
    totalChunks: Math.ceil(file.size / CHUNK_SIZE),
    uploadedChunks: 0,
    progress: 0,
    status: 'pending'
  }
  
  // 创建文件分片
  createFileChunks(file)
}

/**
 * 【核心步骤1】创建文件分片
 * 
 * 原理：
 * - 使用 Blob.slice() 方法切割文件
 * - 每个分片大小固定（如 2MB）
 * - 最后一个分片可能小于设定大小
 */
function createFileChunks(file: File) {
  chunks.value = []
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
  
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, file.size)
    
    chunks.value.push({
      index: i,
      start,
      end,
      chunk: file.slice(start, end),  // 切割文件
      uploaded: false
    })
  }
  
  console.log(`文件已分片：共 ${totalChunks} 个分片`)
}

/**
 * 【核心步骤2】计算文件唯一标识（用于秒传和断点续传）
 * 
 * 原理：
 * - 使用文件内容计算 hash（而非文件名）
 * - 采用抽样计算：取头、中、尾各 2MB + 剩余部分
 * - 这样可以快速得到唯一标识，无需读取整个文件
 */
async function calculateFileHash(file: File): Promise<string> {
  // 简化版：使用文件名+大小+最后修改时间作为标识
  // 生产环境应该使用 spark-md5 计算文件内容的 hash
  const identifier = `${file.name}-${file.size}-${file.lastModified}`
  
  // 使用浏览器内置的 SubtleCrypto API 计算 hash
  const encoder = new TextEncoder()
  const data = encoder.encode(identifier)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex.substring(0, 16)  // 取前16位作为文件标识
}

/**
 * 【核心步骤3】检查服务器已上传的分片（断点续传关键）
 * 
 * 原理：
 * - 上传前先询问服务器哪些分片已存在
 * - 只上传未完成的分片
 * - 实现断点续传
 */
async function checkUploadedChunks(fileHash: string): Promise<number[]> {
  try {
    const response = await fetch(`${SERVER_URL}/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        fileHash,
        filename: currentFile.value?.name,
        totalChunks: chunks.value.length
      })
    })
    
    const data = await response.json()
    return data.uploadedChunks || []
  } catch (error) {
    console.error('检查分片失败:', error)
    return []
  }
}

/**
 * 【核心步骤4】上传单个分片
 * 
 * 原理：
 * - 使用 FormData 封装分片数据
 * - 携带分片索引、文件标识等元信息
 * - 后端根据这些信息存储和合并分片
 */
async function uploadChunk(
  chunk: FileChunk, 
  fileHash: string, 
  filename: string
): Promise<boolean> {
  const formData = new FormData()
  formData.append('chunk', chunk.chunk)           // 分片数据
  formData.append('chunkIndex', String(chunk.index))  // 分片索引
  formData.append('fileHash', fileHash)           // 文件唯一标识
  formData.append('filename', filename)           // 原始文件名
  formData.append('totalChunks', String(chunks.value.length))  // 总分片数
  
  try {
    const response = await fetch(`${SERVER_URL}/upload`, {
      method: 'POST',
      body: formData
    })
    
    return response.ok
  } catch (error) {
    console.error(`分片 ${chunk.index} 上传失败:`, error)
    return false
  }
}

/**
 * 【核心步骤5】通知服务器合并分片
 * 
 * 原理：
 * - 所有分片上传完成后，通知后端
 * - 后端按顺序合并所有分片成完整文件
 */
async function mergeChunks(fileHash: string, filename: string) {
  const response = await fetch(`${SERVER_URL}/merge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileHash,
      filename,
      totalChunks: chunks.value.length
    })
  })
  
  return response.ok
}

/**
 * 【主流程】开始上传
 * 
 * 完整流程：
 * 1. 计算文件唯一标识
 * 2. 检查服务器已上传的分片
 * 3. 标记已上传的分片
 * 4. 依次上传未完成的分片
 * 5. 所有分片完成后，通知服务器合并
 */
async function startUpload() {
  if (!currentFile.value || isUploading.value) return
  
  isUploading.value = true
  uploadProgress.value!.status = 'uploading'
  
  try {
    // 步骤1：计算文件唯一标识
    const fileHash = await calculateFileHash(currentFile.value)
    console.log('文件标识:', fileHash)
    
    // 步骤2：检查已上传的分片（断点续传关键）
    const uploadedIndexes = await checkUploadedChunks(fileHash)
    console.log('已上传分片:', uploadedIndexes)
    
    // 步骤3：标记已上传的分片
    uploadedIndexes.forEach(index => {
      if (chunks.value[index]) {
        chunks.value[index].uploaded = true
      }
    })
    
    // 更新进度
    uploadProgress.value!.uploadedChunks = uploadedIndexes.length
    updateProgress()
    
    // 步骤4：上传未完成的分片
    for (const chunk of chunks.value) {
      if (chunk.uploaded) continue
      
      // 检查是否暂停
      if (!isUploading.value) {
        uploadProgress.value!.status = 'paused'
        return
      }
      
      // 上传分片
      const success = await uploadChunk(
        chunk, 
        fileHash, 
        currentFile.value!.name
      )
      
      if (success) {
        chunk.uploaded = true
        uploadProgress.value!.uploadedChunks++
        updateProgress()
      } else {
        throw new Error(`分片 ${chunk.index} 上传失败`)
      }
    }
    
    // 步骤5：合并分片
    const mergeSuccess = await mergeChunks(fileHash, currentFile.value!.name)
    
    if (mergeSuccess) {
      uploadProgress.value!.status = 'completed'
      uploadProgress.value!.progress = 100
      console.log('文件上传完成！')
      
      // 添加到上传列表
      uploadList.value.unshift({ ...uploadProgress.value! })
    }
    
  } catch (error) {
    console.error('上传失败:', error)
    uploadProgress.value!.status = 'error'
  } finally {
    isUploading.value = false
  }
}

/**
 * 暂停上传
 */
function pauseUpload() {
  isUploading.value = false
  if (uploadProgress.value) {
    uploadProgress.value.status = 'paused'
  }
}

/**
 * 继续上传
 */
function resumeUpload() {
  if (uploadProgress.value?.status === 'paused') {
    startUpload()
  }
}

/**
 * 更新进度
 */
function updateProgress() {
  if (uploadProgress.value) {
    uploadProgress.value.progress = Math.round(
      (uploadProgress.value.uploadedChunks / uploadProgress.value.totalChunks) * 100
    )
  }
}

/**
 * 格式化文件大小
 */
function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
}

/**
 * 获取状态文本
 */
function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '等待上传',
    uploading: '上传中...',
    paused: '已暂停',
    completed: '已完成',
    error: '上传失败'
  }
  return statusMap[status] || status
}

/**
 * 获取状态颜色
 */
function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: '#999',
    uploading: '#409eff',
    paused: '#e6a23c',
    completed: '#67c23a',
    error: '#f56c6c'
  }
  return colorMap[status] || '#999'
}
</script>

<template>
  <div class="file-upload">
    <h2>文件分片上传 + 断点续传 Demo</h2>
    
    <!-- 文件选择 -->
    <div class="upload-area">
      <input
        ref="fileInput"
        type="file"
        @change="handleFileSelect"
        style="display: none"
      />
      <button 
        class="btn btn-primary"
        @click="fileInput?.click()"
        :disabled="isUploading"
      >
        选择文件
      </button>
      
      <span v-if="currentFile" class="file-info">
        {{ currentFile.name }} ({{ formatSize(currentFile.size) }})
      </span>
    </div>
    
    <!-- 上传进度 -->
    <div v-if="uploadProgress" class="progress-section">
      <div class="progress-header">
        <span class="filename">{{ uploadProgress.filename }}</span>
        <span 
          class="status"
          :style="{ color: getStatusColor(uploadProgress.status) }"
        >
          {{ getStatusText(uploadProgress.status) }}
        </span>
      </div>
      
      <!-- 进度条 -->
      <div class="progress-bar">
        <div 
          class="progress-fill"
          :style="{ width: uploadProgress.progress + '%' }"
        ></div>
      </div>
      
      <div class="progress-info">
        <span>{{ uploadProgress.progress }}%</span>
        <span>
          {{ uploadProgress.uploadedChunks }} / {{ uploadProgress.totalChunks }} 分片
        </span>
      </div>
      
      <!-- 控制按钮 -->
      <div class="controls">
        <button
          v-if="uploadProgress.status === 'pending'"
          class="btn btn-success"
          @click="startUpload"
        >
          开始上传
        </button>
        
        <button
          v-if="uploadProgress.status === 'uploading'"
          class="btn btn-warning"
          @click="pauseUpload"
        >
          暂停
        </button>
        
        <button
          v-if="uploadProgress.status === 'paused'"
          class="btn btn-success"
          @click="resumeUpload"
        >
          继续上传
        </button>
      </div>
    </div>
    
    <!-- 上传历史 -->
    <div v-if="uploadList.length > 0" class="upload-list">
      <h3>上传历史</h3>
      <div 
        v-for="(item, index) in uploadList" 
        :key="index"
        class="upload-item"
      >
        <span class="name">{{ item.filename }}</span>
        <span class="size">{{ formatSize(item.fileSize) }}</span>
        <span 
          class="status"
          :style="{ color: getStatusColor(item.status) }"
        >
          {{ getStatusText(item.status) }}
        </span>
      </div>
    </div>
    
    <!-- 原理说明 -->
    <div class="principle">
      <h3>核心原理说明</h3>
      <ol>
        <li><strong>分片上传：</strong>将大文件切割成多个小块（如2MB），逐个上传，避免一次性上传大文件超时</li>
        <li><strong>断点续传：</strong>上传前检查服务器已存在的分片，只上传未完成的分片，中断后可继续</li>
        <li><strong>秒传：</strong>通过文件内容计算唯一hash，如果服务器已存在相同文件，直接返回成功</li>
        <li><strong>分片合并：</strong>所有分片上传完成后，服务器按顺序合并成完整文件</li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.file-upload {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.upload-area {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.file-info {
  color: #606266;
  font-size: 14px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #409eff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #66b1ff;
}

.btn-success {
  background: #67c23a;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #85ce61;
}

.btn-warning {
  background: #e6a23c;
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background: #ebb563;
}

.progress-section {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.filename {
  font-weight: 500;
  color: #303133;
}

.status {
  font-size: 14px;
}

.progress-bar {
  height: 20px;
  background: #e4e7ed;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #409eff, #67c23a);
  border-radius: 10px;
  transition: width 0.3s;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.controls {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.upload-list {
  margin-top: 30px;
}

.upload-list h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 16px;
}

.upload-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 14px;
}

.upload-item .name {
  flex: 1;
  color: #303133;
}

.upload-item .size {
  color: #909399;
  margin: 0 15px;
}

.principle {
  background: #fff8e6;
  border-left: 4px solid #e6a23c;
  padding: 15px;
  border-radius: 4px;
  margin-top: 30px;
}

.principle h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 16px;
}

.principle ol {
  margin: 0;
  padding-left: 20px;
}

.principle li {
  color: #606266;
  line-height: 1.8;
  margin-bottom: 5px;
}

.principle strong {
  color: #303133;
}
</style>
