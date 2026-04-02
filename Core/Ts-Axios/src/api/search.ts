import request from "../http/request";
import type { SearchParams, SearchResult } from "../http/types";

export const searchAPI = async (params?: SearchParams): Promise<SearchResult[]> => {
    const response = await request({
        url: '/posts',
        method: 'GET',
        params
    })
    return (response as unknown as any[]).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.body
    }))
}