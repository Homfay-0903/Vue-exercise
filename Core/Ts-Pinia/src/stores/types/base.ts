export interface BaseState {
    loading: boolean
    error: string | null
}

export interface BaseActions {
    setLoading: (value: boolean) => void
    setError: (value: string) => void
    clearError: () => void
}


