export type AppTarget = 'public' | 'u2k' | 'legacy-archive' | 'internal'

export type AppData = {
  u2k: boolean
  la2016: boolean
  la2020: boolean
  pdr3: boolean
  idr: boolean
}

export type CasSampleQuery = {
  id: string
  name: string
  sql: string
}

export type CasRelease = {
  name: string
  casRelease: string
  reruns: string[]
  sampleQueries: CasSampleQuery[]
}

export type AppEnv = {
  target: AppTarget
  data: AppData
  cas: {
    enabled: boolean
    releases: CasRelease[]
    schemaBrowserUrl: string
  }
}
