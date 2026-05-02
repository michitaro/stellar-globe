export type AppTarget = string

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
}

export type AppTractTileLayers = {
  includeInternalLayers: boolean
  defaultVisibleDatasets: string[]
}

export type AppEnv = {
  target: AppTarget
  data: AppData
  tractTileLayers: AppTractTileLayers
  cas: {
    enabled: boolean
    releases: CasRelease[]
    sampleQueries: CasSampleQuery[]
    schemaBrowserUrl: string
  }
}
