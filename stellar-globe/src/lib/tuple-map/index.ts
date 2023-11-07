export class TupleMap<K extends unknown[], V> {
  private m = new Map<string, V>()
  private idMaker = new TupleIdMaker()

  get(key: K) {
    return this.idMaker.get(key, id => {
      const value = this.m.get(id)
      return {
        value,
        forget: true,
      }
    })
  }

  set(key: K, value: V) {
    this.idMaker.get(key, id => {
      const has = this.m.has(id)
      has || this.m.set(id, value)
      return {
        forget: has,
        value: undefined,
      }
    })
    return this
  }

  has(key: K) {
    return this.idMaker.get(key, id => {
      const has = this.m.has(id)
      return {
        forget: true,
        value: has,
      }
    })
  }

  delete(key: K) {
    return this.idMaker.get(key, id => {
      const value = this.m.delete(id)
      this.idMaker.forget(key)
      return {
        forget: true,
        value,
      }
    })
  }

  clear() {
    this.m.clear()
    this.idMaker.clear()
  }

  _internalMapSize() {
    return (this as any).idMaker.idMaker.m.size
  }
}


class TupleIdMaker {
  private idMaker = new IdMaker()

  get<T>(key: unknown[], cb: (id: string) => { forget: boolean, value: T }) {
    const id = key.map(k => this.idMaker.get(k)).join('-')
    const { forget, value } = cb(id)
    forget && this.forget(key)
    return value
  }

  forget(key: unknown[]) {
    key.forEach(k => this.idMaker.forget(k))
  }

  clear() {
    this.idMaker.clear()
  }
}


type IdInfo = {
  value: number
  refCount: number
}


class IdMaker {
  private serialNumber = 0
  private m = new Map<unknown, IdInfo>()

  get(key: unknown) {
    const idInfo = this.m.get(key)
    if (idInfo !== undefined) {
      ++idInfo.refCount
      return idInfo.value
    }
    else {
      const value = ++this.serialNumber
      this.m.set(key, {
        refCount: 1,
        value
      })
      return value
    }
  }

  forget(key: unknown) {
    const idInfo = this.m.get(key)!
    if (--idInfo.refCount == 0) {
      this.m.delete(key)
    }
  }

  clear() {
    this.m.clear()
  }
}