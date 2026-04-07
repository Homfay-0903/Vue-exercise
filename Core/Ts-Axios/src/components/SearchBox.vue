<template>
    <div class="search-box">
        <input v-model="keyword" type="text" placeholder="请输入关键词搜索..." />
        <div v-if="loading" class="loading">加载中...</div>
        <div v-if="error" class="error">{{ error.message }}</div>
        <ul v-if="list!.length">
            <li v-for="item in list" :key="item.id">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
            </li>
        </ul>
        <div v-else-if="!loading && keyword" class="empty">暂无数据</div>
    </div>
    <hr>
    <div>
        <input type="text" v-model="initValue">
        <p>{{ initValue }}</p>
        <p>{{ throttleValue }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRequest } from '../hooks/useRequest';
import { useDebounce } from '../hooks/useDebounce';
import { useThrottle } from '../hooks/useThrottle';
import { withCache } from '../hooks/useCache';
import { searchAPI } from '../api/search';
import type { SearchResult } from '../http/types';
import { DEFAULT_SEARCH_RESULT } from '../http/types';

const keyword = ref('');
const debouncedKeyword = useDebounce(keyword, 1000);

const initValue = ref('')
const throttleValue = useThrottle(initValue, 3000)

// 对原始 API 函数应用缓存（5分钟）
const cachedSearch = withCache(searchAPI, 5 * 60 * 1000);

// 使用通用请求 Hook 管理状态，传入带缓存的 fetcher
const { loading, error, data: list, run } = useRequest(cachedSearch, {
    initialData: [] as SearchResult[],
    onError: (_err) => {
        // 请求失败时，使用默认数据兜底
        if (list) {
            list.value = DEFAULT_SEARCH_RESULT;
        }
    },
});

// 监听防抖后的关键词变化，发起请求
watch(debouncedKeyword, async (newKeyword: string) => {
    if (!newKeyword?.trim()) {
        list.value = [];
        error.value = null;
        return;
    }
    // run 方法会自动处理 loading、错误，并支持取消上一次未完成请求
    await run({ keyword: newKeyword });
});
</script>

<style scoped></style>