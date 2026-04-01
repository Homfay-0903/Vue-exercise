import { ref, watch, onUnmounted } from 'vue'

export const useDebounce = <T>(value: T, delay: number = 500) => {
    const debounceValue = ref<T>(value)
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

export const debounce = <T extends (...args: any[]) => void>(
    fn: T,
    delay: number = 500
): (...args: Parameters<T>) => void => {
    let timer: number | null = null

    return (...args: Parameters<T>) => {
        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}