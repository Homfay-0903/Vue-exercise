import { ref, watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export const useThrottle = <T>(
    value: Ref<T>,
    delay: number = 500
): Ref<T> => {
    const throttled = ref<T>(value.value) as Ref<T>
    let lastTime = 0
    let timerId: ReturnType<typeof setTimeout> | null = null
    let lastValue: T | null = null

    const watchHandler = watch(
        value,
        (newVal) => {
            const now = Date.now()
            const remaining = (now - lastTime) - delay

            if (remaining < 0) {
                lastValue = newVal

                if (timerId) {
                    clearTimeout(timerId)
                }

                timerId = setTimeout(() => {
                    lastTime = Date.now()
                    if (lastValue !== null) {
                        throttled.value = lastValue
                        lastValue = null
                    }
                    timerId = null
                }, Math.abs(remaining))
            } else {
                lastTime = now
                throttled.value = newVal
                if (timerId) {
                    clearTimeout(timerId)
                    timerId = null
                }
            }
        }
    )

    onUnmounted(() => {
        watchHandler.stop()
        if (timerId) {
            clearTimeout(timerId)
        }
    })

    return throttled
}


export const throttle = <T extends (...args: any[]) => void>(
    fn: T,
    delay: number = 500
): (...args: Parameters<T>) => void => {
    let lastTime = 0

    return (...args: Parameters<T>) => {
        const now = Date.now()

        if (now - lastTime < delay) {
            return
        }

        lastTime = now

        fn(...args)
    }
}

