export function eventEmitter<T = void>() {
  const cbs: ((value: T) => void)[] = []

  const on = (cb: (value: T) => void) => {
    cbs.push(cb)
  }

  const emit = (value: T) => {
    while (cbs.length > 0) {
      cbs.shift()!(value)
    }
  }
  return {
    on,
    emit,
  }
}

export type EventEmitter<T = void> = ReturnType<typeof eventEmitter<T>>
