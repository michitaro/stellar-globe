export type FilterDef = {
  commonName: string
  intrinsicName: string
}


export type FilterMap = FilterDef[]


export const deferredFilterMap = (() => {
  const cache = new Map<
    string,
    {
      promise: Promise<unknown>
      result?: FilterMap,
      error?: string
    }
  >

  return (baseUrl: string) => {
    if (!cache.has(baseUrl)) {
      const promise = (async () => {
        return ((await (await fetch(`${baseUrl}/filter.json`)).json()) as any[])
          .map(normalizeFilterDef)
          .filter(f => !f.commonName.startsWith('.'))
      })()
      cache.set(baseUrl, { promise })
      promise.then(result => {
        cache.get(baseUrl)!.result = result
      }).catch(error => {
        cache.get(baseUrl)!.error = error
      })
    }

    return cache.get(baseUrl)!
  }
})()


export function useFilterMap(baseUrl: string) {
  const { promise, error, result } = deferredFilterMap(baseUrl)
  if (result) {
    return result
  }
  throw error ?? promise
}


function normalizeFilterDef(filterDef: any): FilterDef {
  const intrinsicName = filterDef.fullName ?? filterDef.value
  if (typeof intrinsicName !== 'string') {
    throw new Error(`Invalid filterDef1: ${JSON.stringify(filterDef)}`)
  }
  let commonName = filterDef.shortName ?? makeShortName(intrinsicName)
  if (typeof commonName !== 'string') {
    throw new Error(`Invalid filterDef2: ${JSON.stringify(filterDef)}`)
  }
  const m = intrinsicName.match(/^NB(\d+)$/)
  if (m) {
    commonName = String(Number(m[1]))
  }
  return {
    intrinsicName,
    commonName,
  }
}


function makeShortName(fullName: string) {
  if (fullName.startsWith('HSC-')) {
    return fullName.substring(4).toLowerCase()
  }
  for (const m = fullName.match(/(\d+)/); m;) {
    return String(Number(m[1]))
  }
  return fullName
}


const wideFilters = [
  'u', // ultraviolet
  'b', // blue
  'g', // green
  'v', // visual
  'r', // red
  'i', // infrared
  'z', 'y', 'j', 'h', 'k', 'l',
  'm', 'n', 'q',
]


interface Comparable {
  value: number | string
  subComparable?: () => Comparable
}


function FilterShortNameComparable(shortName: string): Comparable {
  const WIDE_FILTERS = 0
  const NB_FILTERS = 1
  const OTHER_FILTERS = 2

  if (wideFilters.includes(shortName)) {
    return {
      value: WIDE_FILTERS,
      subComparable: () => ({
        value: wideFilters.indexOf(shortName),
      })
    }
  }
  else if (shortName.match(/^\d+$/i)) {
    return {
      value: NB_FILTERS,
      subComparable: () => ({
        value: Number(shortName.match(/^(\d+)$/i)![1]),
      }),
    }
  }
  return {
    value: OTHER_FILTERS,
    subComparable: () => ({
      value: shortName,
    }),
  }
}


function compareComparable(a: Comparable, b: Comparable): number {
  if (a.value === b.value && a.subComparable && b.subComparable) {
    return compareComparable(a.subComparable(), b.subComparable())
  }
  else {
    if (typeof a.value === 'string' && typeof b.value === 'string') {
      return a.value.localeCompare(b.value)
    }
    if (typeof a.value === 'number' && typeof b.value === 'number') {
      return a.value - b.value
    }
    throw new Error(`Logic error: comparing ${JSON.stringify(a.value)} and ${JSON.stringify(b.value)}`)
  }
}


export function compareFilterShortName(a: string, b: string) {
  return compareComparable(FilterShortNameComparable(a), FilterShortNameComparable(b))
}
