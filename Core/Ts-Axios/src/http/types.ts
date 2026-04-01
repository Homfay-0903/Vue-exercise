// 通用响应结构
export interface ApiResponse<T = any> {
    code: number;          // 业务状态码，0 表示成功
    message: string;
    data: T;
}

// 搜索接口参数类型
export interface SearchParams {
    keyword: string;
}

// 搜索接口返回的数据类型（示例）
export interface SearchResult {
    id: number;
    title: string;
    description: string;
}

// 默认数据（兜底数据）
export const DEFAULT_SEARCH_RESULT: SearchResult[] = [
    { id: -1, title: '暂无数据', description: '请求失败，显示默认内容' }
];