export function delay(interval = 500) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, interval)
    })
}
