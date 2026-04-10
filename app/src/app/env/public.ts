import { publicCasSampleQueries } from './casSampleQueries'
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
      { name: 'pdr3' },
      { name: 'pdr3-citus-columnar' },
      { name: 'pdr2' },
      { name: 'pdr2-citus-columnar' },
      { name: 'chorus_pdr1' },
      { name: 'pdr1' },
    ],
    sampleQueries: publicCasSampleQueries,
  },
}
