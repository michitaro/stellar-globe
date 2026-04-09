import { pdr3SampleQueries } from './casSampleQueries'
import type { AppEnv } from './types'

export const publicEnv: AppEnv = {
  target: 'public',
  data: {
    u2k: false,
    la2016: false,
    la2020: false,
    pdr3: true,
    idr: false,
  },
  cas: {
    enabled: true,
    schemaBrowserUrl: 'https://hscdata.mtk.nao.ac.jp/schema_browser3/',
    releases: [
      {
        name: 'pdr3',
        casRelease: 'pdr3',
        reruns: ['pdr3_wide', 'pdr3_dud'],
        sampleQueries: pdr3SampleQueries,
      },
    ],
  },
}
