import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from './types';

const request: AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:3000/',
    timeout: 15000
})

// 请求拦截器
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json'
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        const res = response.data

        if (res.code !== 0) {
            const errorMsg = getErrorMessage(res.code, res.message)
            return Promise.reject(new Error(errorMsg))
        }

        return res.data
    },
    (error) => {
        let message = '网络异常，请稍后重试';
        if (error.message.includes('timeout')) {
            message = '请求超时'
        } else if (error.message.includes('Network Error')) {
            message = '网络连接失败'
        }
        return Promise.reject(new Error(message))
    }
)

const getErrorMessage = (errorCode: number, defaultMsg: string): string => {
    const errorMap: Record<number, string> = {
        401: '未授权，请重新登录',
        403: '拒绝访问',
        404: '请求资源不存在',
        500: '服务器内部错误',
    }

    return errorMap[errorCode] || defaultMsg || '请求失败'
}

export default request