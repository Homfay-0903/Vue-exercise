import { defineStore } from "pinia";
import { reactive, computed, toRefs } from "vue";
import type { UserInfo } from "./types/user";

const mockLoginApi = async () => ({
    id: Math.ceil(Math.random() * 10),
    account: Math.ceil(Math.random() * 100),
    nickname: Math.random().toString(36).slice(-5)
})

export const useUserStore = defineStore('user', () => {
    //state
    const state = reactive({
        userInfo: null as UserInfo | null,
        isLogin: false,
    })

    //getters
    const displayName = computed(() => state.userInfo?.nickname || 'Guest')

    //actions
    const Login = async () => {
        const data = await mockLoginApi()
        state.userInfo = data
        state.isLogin = true
    }

    const LogOut = () => {
        state.userInfo = null
        state.isLogin = false
    }

    const updateNickName = (newNickName: string) => {
        if (state.userInfo) {
            state.userInfo.nickname = newNickName
        }
    }

    return {
        ...toRefs(state),
        displayName,
        Login,
        LogOut,
        updateNickName
    }
})