<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

/**
 * 虚拟化列表演示组件
 * 包含虚拟化列表和普通列表的对比展示
 */

// 定义数据类型
interface ListItem {
    id: number
    name: string
    email: string
    avatar: string
}

// Props
defineProps<{
    itemCount: number
}>()

// 生成大量测试数据
const items = ref<ListItem[]>([])

// 生成随机数据
const generateItems = (count: number) => {
    const data = []
    for (let i = 0; i < count; i++) {
        data.push({
            id: i + 1,
            name: `用户 ${i + 1}`,
            email: `user${i + 1}@example.com`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`
        })
    }
    items.value = data
}

// 切换显示模式
const showVirtual = ref(true)

// 暴露方法给父组件
defineExpose({
    generateItems
})
</script>

<template>
    <div class="virtual-list-demo">
        <!-- 控制面板 -->
        <div class="controls">
            <button @click="showVirtual = !showVirtual">
                {{ showVirtual ? '切换到普通列表' : '切换到虚拟化列表' }}
            </button>
            <span class="data-info">数据总量: {{ itemCount }} 条</span>
        </div>

        <!-- 对比展示 -->
        <div class="comparison">
            <!-- 虚拟化列表 -->
            <div v-if="showVirtual" class="list-container">
                <h3>🚀 虚拟化列表 (vue-virtual-scroller)</h3>
                <p class="hint">只渲染可见区域，支持 {{ itemCount }} 条数据</p>

                <!-- 
          RecycleScroller 组件使用说明：
          
          :items - 数据源数组
          :item-size - 每个项目的预估高度（像素）
          key-field - 用于标识每个项目的唯一字段名
          v-slot="{ item, index }" - 插槽，提供当前项数据和索引
          
          重要属性：
          - item-size: 必须准确设置，影响滚动计算
          - key-field: 必须唯一，用于元素复用
          - page-mode: 是否使用页面级滚动（默认 false）
        -->
                <RecycleScroller class="scroller" :items="items" :item-size="80" key-field="id"
                    v-slot="{ item, index }">
                    <div v-if="item" class="item">
                        <img :src="item.avatar" :alt="item.name" class="avatar" />
                        <div class="item-content">
                            <div class="item-header">
                                <span class="item-id">#{{ item.id }}</span>
                                <span class="item-name">{{ item.name }}</span>
                            </div>
                            <div class="item-email">{{ item.email }}</div>
                        </div>
                    </div>
                </RecycleScroller>
            </div>

            <!-- 普通列表 -->
            <div v-else class="list-container">
                <h3>🐢 普通列表</h3>
                <p class="hint">渲染所有 DOM 节点，仅展示 100 条数据</p>
                <div class="normal-list">
                    <div v-for="item in items.slice(0, 100)" :key="item.id" class="item">
                        <img :src="item.avatar" :alt="item.name" class="avatar" />
                        <div class="item-content">
                            <div class="item-header">
                                <span class="item-id">#{{ item.id }}</span>
                                <span class="item-name">{{ item.name }}</span>
                            </div>
                            <div class="item-email">{{ item.email }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.virtual-list-demo {
    margin-bottom: 30px;
}

.controls {
    display: flex;
    gap: 15px;
    align-items: center;
    margin-bottom: 20px;
}

button {
    background: #42b983;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s;
}

button:hover {
    background: #35a070;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(66, 185, 131, 0.4);
}

.data-info {
    color: #7f8c8d;
    font-size: 14px;
}

.comparison {
    margin-bottom: 30px;
}

.list-container {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 20px;
}

h3 {
    color: #2c3e50;
    margin-bottom: 10px;
}

.hint {
    color: #7f8c8d;
    font-size: 13px;
    margin-bottom: 15px;
}

.scroller {
    height: 400px;
    background: white;
    border-radius: 8px;
    overflow-y: auto;
}

.normal-list {
    height: 400px;
    overflow-y: auto;
    background: white;
    border-radius: 8px;
}

.item {
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #e0e0e0;
    transition: background 0.2s;
}

.item:hover {
    background: #f5f5f5;
}

.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
    background: #e0e0e0;
}

.item-content {
    flex: 1;
}

.item-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
}

.item-id {
    background: #42b983;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
}

.item-name {
    font-weight: 600;
    color: #2c3e50;
}

.item-email {
    color: #7f8c8d;
    font-size: 13px;
}
</style>
