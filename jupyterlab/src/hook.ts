export function hook<T = void>() {
  const cbs: ((value: T) => void)[] = []
  const add = (cb: (value: T) => void) => {
    cbs.push(cb)
  }
  const run = (value: T) => {
    while (cbs.length > 0) {
      cbs.shift()!(value)
    }
  }
  return {
    add,
    run,
  }
}

export type Hook<T = void> = ReturnType<typeof hook<T>>
