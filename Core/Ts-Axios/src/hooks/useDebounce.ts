import { ref, watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export const useDebounce = <T>(value: Ref<T>, delay: number = 500): Ref<T> => {
    const debounced = ref<T>(value.value) as Ref<T>
    let timer: ReturnType<typeof setTimeout> | null = null

    const watchHandler = watch(
        value,
        //() => value.value,
        (newVal) => {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                debounced.value = newVal
            }, delay)
        },
        { immediate: false }
    )

    onUnmounted(() => {
        if (timer) {
            clearTimeout(timer)
        }
        watchHandler.stop()
    })

    return debounced
}

export const debounce = <T extends (...args: any[]) => void>(
    fn: T,
    delay: number = 500
): (...args: Parameters<T>) => void => {
    let timer: ReturnType<typeof setTimeout> | null = null

    return (...args: Parameters<T>) => {
        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}