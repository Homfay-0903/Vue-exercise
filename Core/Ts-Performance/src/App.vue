<script setup lang="ts">
import { ref, onMounted } from 'vue'
import InfoBox from './components/InfoBox.vue'
import VirtualListDemo from './components/VirtualListDemo.vue'
import CodeExample from './components/CodeExample.vue'
import FileUpload from './components/FileUpload.vue'

/**
 * 虚拟化列表工作原理：
 * 
 * 1. 核心思想：只渲染可见区域的元素，而不是渲染所有元素
 * 
 * 2. 实现机制：
 *    - 计算可视区域能容纳多少个元素
 *    - 根据滚动位置计算当前应该显示哪些元素
 *    - 使用绝对定位将元素放置在正确的位置
 *    - 通过 transform 或 padding 撑开容器高度，使滚动条正常工作
 * 
 * 3. 性能优势：
 *    - DOM 节点数量固定，不随数据量增长
 *    - 内存占用低，渲染速度快
 *    - 适用于大数据量列表（成千上万条数据）
 */

// 生成大量测试数据
const itemCount = 10000 // 1万条数据

// 获取组件引用
const virtualListDemoRef = ref<InstanceType<typeof VirtualListDemo>>()

onMounted(() => {
  // 初始化数据
  virtualListDemoRef.value?.generateItems(itemCount)
})
</script>

<template>
  <div class="container">
    <h1>Vue3 性能优化 Demo</h1>

    <!-- 文件分片上传 Demo -->
    <section class="demo-section">
      <FileUpload />
    </section>

    <!-- 说明区域 -->
    <InfoBox />

    <!-- 虚拟化列表演示 -->
    <VirtualListDemo ref="virtualListDemoRef" :item-count="itemCount" />

    <!-- 代码示例 -->
    <CodeExample />
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
