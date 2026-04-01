import request from "../http/request";
import type { SearchParams, SearchResult } from "../http/types";

export const searchAPI = async (params: SearchParams): Promise<SearchResult[]> => {
    return request({
        url: '/search',
        method: 'GET',
        params
    })
}