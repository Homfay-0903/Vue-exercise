import { useRouter } from 'vue-router';
import type { RouteNames } from '../router/types';

// 定义参数类型的映射，根据路由名称约束参数
interface RouteParamsMap {
    [RouteNames.ProductDetail]: { id: string | number }
    [RouteNames.Login]: undefined
    [RouteNames.LogOut]: undefined
    [RouteNames.Home]: undefined
    [RouteNames.NotFound]: undefined
}

// 泛型函数：接收路由名 K，并检查 params 是否符合 K 的定义
export const useTypedRouterPush = () => {
    const router = useRouter()

    return function typedPush<K extends keyof RouteParamsMap>(
        name: K,
        params?: RouteParamsMap[K]
    ) {
        // Vue Router 的 params 类型更宽（RouteParamsRaw 等），
        // 将本地受限类型转换为路由允许的原始参数类型以消除不兼容错误。
        return router.push({ name, params: params as unknown as Record<string, any> });
    };
}
