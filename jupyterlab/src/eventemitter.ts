export function EventEmitter<T = void>({ once }: { once: boolean }) {
  const cbs: ((value: T) => void)[] = []

  const on = (cb: (value: T) => void) => {
    cbs.push(cb)
    return () => {
      const i = cbs.indexOf(cb)
      if (i >= 0) {
        cbs.splice(i, 1)
      }
    }
  }

  const emit = (value: T) => {
    if (once) {
      while (cbs.length > 0) {
        cbs.shift()!(value)
      }
    } else {
      throw Error('NotImplemented')
      // for (let i = cbs.length - 1; i >= 0; --i) {
      //   cbs[i](value)
      // }
    }
  }

  return {
    on,
    emit,
  }
}

export type EventEmitter<T = void> = ReturnType<typeof EventEmitter<T>>