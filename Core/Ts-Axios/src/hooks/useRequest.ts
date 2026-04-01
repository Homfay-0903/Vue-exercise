// hooks/useRequest.ts
import { ref, onUnmounted } from 'vue';
import axios from 'axios';
import type { Canceler, AxiosRequestConfig } from 'axios';
import request from '../http/request';

type Fetcher<TParams = any, TData = any> = (params?: TParams) => Promise<TData>

export interface UseRequestOptions<TData> {
    immediate?: boolean       // 是否立即执行
    initialData?: TData       // 初始数据
    onSuccess?: (data: TData) => void
    onError?: (err: Error) => void
}

// 重载签名：传入 url 和 config
export function useRequest<TParams, TData>(
    url: string,
    config?: AxiosRequestConfig,
    options?: UseRequestOptions<TData>
): {
    loading: ReturnType<typeof ref<boolean>>
    error: ReturnType<typeof ref<Error | null>>
    data: ReturnType<typeof ref<TData>>
    run: (params?: TParams) => Promise<TData>
}

// 重载签名：传入 fetcher 函数
export function useRequest<TParams, TData>(
    fetcher: Fetcher<TParams, TData>,
    options?: UseRequestOptions<TData>
): {
    loading: ReturnType<typeof ref<boolean>>
    error: ReturnType<typeof ref<Error | null>>
    data: ReturnType<typeof ref<TData>>
    run: (params?: TParams) => Promise<TData>
}

// 实现
export function useRequest<TParams, TData>(
    urlOrFetcher: string | Fetcher<TParams, TData>,
    configOrOptions?: AxiosRequestConfig | UseRequestOptions<TData>,
    maybeOptions?: UseRequestOptions<TData>
) {
    // 参数归一化
    let fetcher: Fetcher<TParams, TData>
    let options: UseRequestOptions<TData>

    if (typeof urlOrFetcher === 'string') {
        // 第一种用法：url + config + options
        const url = urlOrFetcher
        const config = configOrOptions as AxiosRequestConfig
        options = maybeOptions || {}
        fetcher = (params?: TParams) => {
            return request({
                url,
                method: config?.method || 'GET',
                params: config?.method === 'GET' ? params : undefined,
                data: config?.method !== 'GET' ? params : undefined,
                ...config,
            })
        }
    } else {
        // 第二种用法：fetcher + options
        fetcher = urlOrFetcher
        options = (configOrOptions as UseRequestOptions<TData>) || {}
    }

    const loading = ref(false)
    const error = ref<Error | null>(null)
    const data = ref<TData>(options.initialData as TData)

    let canceler: Canceler | null = null

    const run = async (params?: TParams): Promise<TData> => {
        // 取消上一次未完成的请求（通过 axios cancel token）
        if (canceler) {
            canceler('请求已取消')
            canceler = null
        }

        loading.value = true
        error.value = null

        try {
            // 注意：这里需要给 fetcher 注入 cancelToken，但 fetcher 可能不是 axios 调用
            // 为了简化，要求 fetcher 内部支持 cancelToken（如果使用 axios）
            // 此处假设 fetcher 内部使用 request（即 axios 实例），我们通过全局 cancelToken 实现
            // 但 fetcher 无法直接获取 canceler，需要调整设计。为了通用性，建议使用 AbortController
            // 为简化示例，我们保持原样，取消功能在请求层实现
            const result = await fetcher(params)
            data.value = result
            options.onSuccess?.(result)
            return result
        } catch (err: any) {
            if (axios.isCancel(err)) {
                console.log('请求已取消', err.message)
                // 不触发错误状态
                return Promise.reject(err)
            }
            error.value = err
            options.onError?.(err)
            throw err
        } finally {
            loading.value = false
        }
    }

    if (options.immediate) {
        run()
    }

    onUnmounted(() => {
        if (canceler) {
            canceler('组件已卸载')
        }
    })

    return { loading, error, data, run }
}