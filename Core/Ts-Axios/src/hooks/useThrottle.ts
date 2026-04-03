export const throttle = <T extends (...args: any[]) => void>(
    fn: T,
    delay: number = 500
): (...args: Parameters<T>) => void => {
    let lastTime = 0
    let timer: ReturnType<typeof setTimeout> | null = null

    return (...args: Parameters<T>) => {
        const now = Date.now()

        if (now - lastTime < delay) {
            return
        }

        lastTime = now

        fn(...args)
    }
}

