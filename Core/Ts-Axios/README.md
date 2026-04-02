# Vue3 + Axios + TS 练习题

1.基于 TS 封装 Axios 实例：定义请求拦截器（添加 Token、设置 Content-Type）、响应拦截器（统一处理错误码、解析响应数据），要求所有请求 / 响应的参数、返回值均通过 TS 类型约束。

2.封装一个通用的请求 Hook（基于 setup + TS）：支持「加载状态、错误信息、取消请求」，要求 TS 约束请求参数、响应数据类型，且组件卸载时自动取消未完成的请求。

3.实现搜索框防抖请求：输入关键词后延迟 500ms 发送请求，要求 TS 约束搜索参数、返回数据类型，且连续输入时取消上一次未完成的请求。

4.基于 TS 实现接口数据缓存：封装一个缓存函数，相同参数的请求在 5 分钟内直接返回缓存数据，要求 TS 约束缓存的 key/value 类型，且缓存过期后自动重新请求。

5.处理接口异常兜底：请求失败时显示默认数据，要求 TS 约束默认数据的类型与接口响应数据一致，且错误提示文案根据错误码动态生成。

# 常见的免费 API：

JSONPlaceholder - https://jsonplaceholder.typicode.com/
PokeAPI - https://pokeapi.co/
The Movie DB (需要 API key)
GitHub API (有速率限制)
Rick and Morty API - https://rickandmortyapi.com/
JokeAPI - https://sv443.net/jokeapi/v2/
Cat API - https://catfact.ninja/
Dog API - https://dog.ceo/dog-api/
Random User API - https://randomuser.me/api/
Open Library API - https://openlibrary.org/api/books
