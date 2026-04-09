import { internalSampleQueries, pdr3SampleQueries } from './casSampleQueries'
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
      {
        name: 'dr4',
        casRelease: 'dr4',
        reruns: ['s23b_wide', 's23b_deep', 's23b_deep2'],
        sampleQueries: internalSampleQueries,
      },
      {
        name: 'pdr3',
        casRelease: 'pdr3',
        reruns: ['pdr3_wide', 'pdr3_dud'],
        sampleQueries: pdr3SampleQueries,
      },
    ],
  },
}
