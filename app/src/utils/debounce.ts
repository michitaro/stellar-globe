export function debounce<CB extends (...args: any[]) => void>(wait: number, cb: CB) {
  let timer: undefined | ReturnType<typeof setTimeout> = undefined
  const stop = () => {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }
  }
  const f = ((...args: unknown[]) => {
    stop()
    if (wait === 0) {
      cb(...args)
    }
    else {
      timer = setTimeout(() => {
        timer = undefined
        cb(...args)
      }, wait)
    }
  }) as CB
  return Object.assign(f, { stop })
}
