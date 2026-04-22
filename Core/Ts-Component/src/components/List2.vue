<template>
    <div class="list-container" ref="listRef" @scroll="handleScroll">
        <div class="list-item" v-for="item in list" :key="item.id">
            {{ item.content }}
        </div>
        <div v-if="loading" class="loading">
            loading...
        </div>
        <div v-else-if="noMore" class="no-more">
            no more here
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface ListItem {
    id: number
    content: string
}

interface Props {
    pageSize?: number
}

interface Emits {
    'load-data': [page: number]
}

const props = withDefaults(defineProps<Props>(), {
    pageSize: 10
})
const emits = defineEmits<Emits>()

const listRef = ref<HTMLDivElement | null>(null)

const list = ref<ListItem[]>([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)

const loadData = async () => {
    if (loading.value || noMore.value) {
        return
    }

    loading.value = true
    emits('load-data', page.value)
}

const setList = (data: ListItem[], isLastPage: boolean) => {
    list.value = [...list.value, ...data]
    loading.value = false
    noMore.value = isLastPage
    page.value++
}

const handleScroll = () => {
    const el = listRef.value
    if (!el) {
        return
    }

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
        loadData()
    }
}

defineExpose({ setList })

onMounted(() => {
    loadData()
})
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