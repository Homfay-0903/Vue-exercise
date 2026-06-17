<script setup lang="ts">
/**
 * 信息说明组件
 * 用于展示虚拟化列表的工作原理和优势
 */
</script>

<template>
  <div class="info-box">
    <h2>📊 工作原理</h2>
    <p><strong>虚拟化列表</strong>只渲染可视区域内的元素，通过动态计算和复用 DOM 节点来提升性能。</p>
    <ul>
      <li>✅ 渲染的 DOM 节点数量固定（约 20-30 个）</li>
      <li>✅ 支持数万甚至数十万条数据</li>
      <li>✅ 滚动流畅，内存占用低</li>
    </ul>
  </div>
</template>

<style scoped>
.info-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.info-box h2 {
  color: white;
  margin-top: 0;
  margin-bottom: 15px;
}

.info-box ul {
  margin: 10px 0;
  padding-left: 20px;
}

.info-box li {
  margin: 5px 0;
}
</style>
