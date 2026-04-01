interface CacheItem<T> {
    data: T
    expireAt: number
}

const cacheMap = new Map<string, CacheItem<any>>()

const generateKey = (fnName: string, params?: any): string => {
    return `${fnName}::${params ? JSON.stringify(params) : ''}`
}

export const withCache = <TParams, TData>(
    fn: (params?: TParams) => Promise<TData>,
    ttl: number = 5 * 60 * 1000
): (params?: TParams, forceRefresh?: boolean) => Promise<TData> => {
    return async (params?: TParams, forceRefresh = false) => {
        const key = generateKey(fn.name, params)
        const cached = cacheMap.get(key)

        if (!forceRefresh && cached && Date.now() < cached.expireAt) {
            return cached.data
        }

        const data = await fn(params)
        cacheMap.set(key, { data, expireAt: Date.now() + ttl })

        return data
    }
}