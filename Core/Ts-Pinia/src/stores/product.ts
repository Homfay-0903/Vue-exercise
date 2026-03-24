import { defineStore } from "pinia";
import { useBaseStoreLogic } from "./base/useBaseStoreLogic";
import type { Product } from "./types/product";
import { ref } from "vue";

export const useProductStore = defineStore('product', () => {
    //state
    const { loading, error, setLoading, setError, clearError } = useBaseStoreLogic()
    const products = ref<Product[]>([])

    //aciton
    const fetchProducts = async () => {
        setLoading(true)
        clearError()
        try {
            await new Promise(reslove => setTimeout(reslove, 2000))
            products.value.push({
                id: Math.ceil(Math.random() * 10),
                name: Math.random().toString(36).slice(-5)
            })
        } catch (error: any) {
            setError(error.message || 'Failed to fetch')
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        setLoading,
        setError,
        clearError,
        products,
        fetchProducts
    }
})