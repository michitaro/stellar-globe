import { describe, expect, it } from "vitest"
import { TupleMap } from "~/lib/tuple-map"

describe('TupleMap', () => {
  it('basic tests', () => {
    const tm = new TupleMap<[number, number], string>()

    expect(tm.get([0, 0])).toBeUndefined()

    tm.set([0, 0], '0,0')

    expect(tm.get([0, 0])).toBe('0,0')
    expect(tm.get([0, 1])).toBe(undefined)

    tm.delete([0, 0])
    expect(tm.get([0, 0])).toBeUndefined()

    tm.set([1, 2], '1,2')
    tm.set([1, 2], '1,2')
    expect(tm.has([1, 2])).toBe(true)
    expect(tm.get([1, 2])).toBe('1,2')

    tm.delete([1, 2])
    expect(tm.has([1, 2])).toBe(false)
    expect(tm._internalMapSize()).toBe(0)

    tm.set([1, 2], '1,2')
    tm.clear()
    expect(tm.get([1, 2])).toBeUndefined()
  })
})
