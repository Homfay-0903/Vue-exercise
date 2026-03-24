import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { UserInfo } from "./types/user";

const mockLoginApi = async () => ({
    id: Math.ceil(Math.random() * 10),
    account: Math.ceil(Math.random() * 100),
    nickname: Math.random().toString(36).slice(-5)
})

export const useUserStore = defineStore('user', () => {
    //state
    const userInfo = ref<UserInfo | null>(null)
    const isLogin = ref<boolean>(false)

    //getters
    const displayName = computed(() => userInfo.value?.nickname || 'Guest')

    //actions
    const Login = async () => {
        const data = await mockLoginApi()
        userInfo.value = data
        isLogin.value = true
    }

    const LogOut = () => {
        userInfo.value = null
        isLogin.value = false
    }

    const updateNickName = (newNickName: string) => {
        if (userInfo.value) {
            userInfo.value.nickname = newNickName
        }
    }

    return {
        userInfo,
        isLogin,
        displayName,
        Login,
        LogOut,
        updateNickName
    }
})