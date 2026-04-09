import { hsclaSampleQueries, pdr3SampleQueries } from './casSampleQueries'
import type { AppEnv } from './types'

export const legacyArchiveEnv: AppEnv = {
  target: 'legacy-archive',
  data: {
    u2k: false,
    la2016: true,
    la2020: true,
    pdr3: false,
    idr: false,
  },
  cas: {
    enabled: true,
    schemaBrowserUrl: 'https://hscdata.mtk.nao.ac.jp/schema_browser3/',
    releases: [
      {
        name: 'hscla2020',
        casRelease: 'hscla2020',
        reruns: ['la2020'],
        sampleQueries: hsclaSampleQueries,
      },
      {
        name: 'hscla2016',
        casRelease: 'hscla2016',
        reruns: ['la2016'],
        sampleQueries: hsclaSampleQueries,
      },
      {
        name: 'hscla2014',
        casRelease: 'hscla2014',
        reruns: ['la2014'],
        sampleQueries: hsclaSampleQueries,
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
