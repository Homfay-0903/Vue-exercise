<script setup lang="ts">
/**
 * 代码示例组件
 * 展示 vue-virtual-scroller 的基本使用方法
 */
</script>

<template>
  <div class="code-example">
    <h3>📝 基本使用代码</h3>
    <pre v-pre><code>&lt;RecycleScroller
  :items="items"           // 数据源
  :item-size="80"          // 项目高度
  key-field="id"           // 唯一标识字段
  v-slot="{ item }"        // 插槽获取数据
&gt;
  &lt;div class="item"&gt;
    {{ item.name }}
  &lt;/div&gt;
&lt;/RecycleScroller&gt;</code></pre>
  </div>
</template>

<style scoped>
.code-example {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 20px;
  border-radius: 10px;
  overflow-x: auto;
}

.code-example h3 {
  color: #42b983;
  margin-top: 0;
  margin-bottom: 15px;
}

.code-example code {
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.6;
}
</style>
