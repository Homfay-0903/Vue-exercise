export interface UserInfo {
    id: number
    account: number
    nickname: string
}

export interface UserState {
    info: UserInfo
    isLogin: boolean
}