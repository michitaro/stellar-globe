import { internalCasSampleQueries } from './casSampleQueries'
import type { AppEnv } from './types'

export const internalEnv: AppEnv = {
  target: 'internal',
  data: {
    u2k: false,
    la2016: false,
    la2020: false,
    pdr3: false,
    idr: true,
  },
  cas: {
    enabled: true,
    schemaBrowserUrl: 'https://hscdata.mtk.nao.ac.jp/schema_browser3/',
    releases: [
      { name: 's23b_wide' },
      { name: 's23b_dud' },
    ],
    sampleQueries: internalCasSampleQueries,
  },
}
