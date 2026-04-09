import type { AppEnv } from './types'

export const u2kEnv: AppEnv = {
  target: 'u2k',
  data: {
    u2k: true,
    la2016: false,
    la2020: false,
    pdr3: false,
    idr: false,
  },
  cas: {
    enabled: false,
    schemaBrowserUrl: 'https://hscdata.mtk.nao.ac.jp/schema_browser3/',
    releases: [],
    sampleQueries: [],
  },
}
