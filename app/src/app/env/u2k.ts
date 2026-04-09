import { u2kSampleQueries } from './casSampleQueries'
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
    enabled: true,
    schemaBrowserUrl: 'https://hscdata.mtk.nao.ac.jp/schema_browser3/',
    releases: [
      {
        name: 'u2k',
        casRelease: 'u2k',
        reruns: ['s18a_dud_u2k'],
        sampleQueries: u2kSampleQueries,
      },
    ],
  },
}
