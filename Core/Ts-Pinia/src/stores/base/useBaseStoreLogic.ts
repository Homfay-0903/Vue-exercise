import { ref } from "vue"

export const useBaseStoreLogic = () => {
    const loading = ref<boolean>(false)
    const error = ref<string | null>(null)

    const setLoading = (value: boolean) => {
        loading.value = value
    }
    const setError = (value: string | null) => {
        error.value = value
    }
    const clearError = () => {
        error.value = null
    }

    return {
        loading,
        error,
        setLoading,
        setError,
        clearError
    }
}