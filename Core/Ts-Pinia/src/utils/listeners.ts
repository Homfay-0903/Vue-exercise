import { useUserStore } from "../stores/user";
import type { SubscriptionCallback } from "pinia";

export const setupUserStoreListener = () => {
    const userStore = useUserStore()

    const callback: SubscriptionCallback<typeof userStore.$state> = (mutation, _state) => {
        const events = Array.isArray(mutation.events) ? mutation.events : [mutation.events]

        //user.ts中应该改为使用reactive
        events.forEach(event => {
            if (event.type === 'set') {
                console.group(`🔍 检测到变化: ${event.key}`)
                console.log('📍 变化路径:', event.key)
                console.log('⬇️ 旧值:', event.oldValue)
                console.log('⬆️ 新值:', event.newValue)

                if (event.key === 'isLogin') {
                    if (event.newValue === true) {
                        console.log('🎉 用户已登录！')
                    } else {
                        console.log('👋 用户已退出！')
                    }
                }

                console.groupEnd()
            }
        })
    }

    const unsubscribe = userStore.$subscribe(callback)

    return unsubscribe
}