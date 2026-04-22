<template>
    <div class="list-container" ref="listRef" @scroll="handleScroll">
        <!-- 列表 -->
        <div v-for="item in list" :key="item.id" class="list-item">
            {{ item.content }}
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="noMore" class="no-more">没有更多了</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 列表项类型
export interface ListItem {
    id: number;
    content: string;
}

interface Props {
    pageSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
    pageSize: 10,
});

const emit = defineEmits<{
    'load-data': [page: number];
}>();

// DOM 引用
const listRef = ref<HTMLDivElement | null>(null);

// 状态
const list = ref<ListItem[]>([]);
const page = ref(1);
const loading = ref(false);
const noMore = ref(false);

// 模拟接口请求
const loadData = async () => {
    if (loading.value || noMore.value) return;

    loading.value = true;
    // 通知父组件加载数据
    emit('load-data', page.value);
};

// 接收父组件传入的列表数据
const setList = (data: ListItem[], isLastPage: boolean) => {
    list.value = [...list.value, ...data];
    loading.value = false;
    noMore.value = isLastPage;
    page.value++;
};

// 防抖滚动判断
const handleScroll = () => {
    const el = listRef.value;
    if (!el) return;

    // 触底判断
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
        loadData();
    }
};

// 暴露方法给父组件
defineExpose({ setList });

// 首次加载
onMounted(() => {
    loadData();
});
</script>

<style scoped>
.list-container {
    height: 400px;
    overflow-y: auto;
    border: 1px solid #eee;
    padding: 10px;
}

.list-item {
    padding: 12px;
    border-bottom: 1px solid #f5f5f5;
}

.loading,
.no-more {
    text-align: center;
    padding: 10px;
    color: #666;
}
</style>