import { ref, watch, onUnmounted } from 'vue'

export const useDebounce = <T>(value: T, delay: number = 500) => {
    const debounceValue = ref(value) as { value: T }
    let timer: number | null = null

    watch(
        () => value,
        (newVal) => {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                debounceValue.value = newVal
            }, delay);
        },
        { immediate: true }
    )

    onUnmounted(() => {
        if (timer) {
            clearTimeout(timer)
        }
    })
}