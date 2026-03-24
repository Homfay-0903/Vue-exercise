# Vue3 + Pinia + TS 练习题

1.基于 TS 定义用户信息类型（UserInfo），封装一个 userStore，包含 state（用户信息、登录状态）、actions（登录 / 退出 / 更新用户昵称），并在组件中通过 TS 类型约束调用 Store 方法。

2.实现 Pinia 模块化：拆分 cartStore（购物车）和 goodsStore（商品），要求 TS 约束 Store 间互相调用的参数类型，且 cartStore 能监听 goodsStore 的商品价格变化并更新购物车总价。

3.给 cartStore 集成 pinia-plugin-persistedstate，实现购物车数据持久化，要求 TS 定义持久化数据的类型，且持久化时过滤掉临时字段（如 loading）。

4.封装一个通用的 Pinia Store 基类（基于 TS 泛型），包含通用的「加载状态、错误信息」管理，让所有业务 Store 继承该基类，实现代码复用。

5.使用 Pinia 的 subscribe 方法监听 userStore 的登录状态变化，要求 TS 约束监听回调的参数类型，且状态变化时打印「旧值 / 新值 / 变化路径」。
