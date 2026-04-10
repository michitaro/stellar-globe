import { test, vi } from 'vitest'
import { regionsSlice } from '../regions/regionsSlice'

vi.mock('../../env', () => ({
  defaultCasSql: () => 'SELECT 1',
  env: () => ({
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
      releases: [{ name: 'pdr3' }, { name: 'pdr2' }],
      sampleQueries: [],
      schemaBrowserUrl: 'https://example.invalid/schema_browser3/',
    },
  }),
  findCasRelease: (releaseName?: string) => [{ name: 'pdr3' }, { name: 'pdr2' }].find(release => release.name === releaseName) ?? { name: 'pdr3' },
}))

vi.mock('../../store/stateSync/StorageSync', () => ({
  readStorageState: () => ({}),
}))

import { CasState, casSlice } from './casSlice'

function makeState(overrides: Partial<CasState> = {}): CasState {
  return {
    enabled: true,
    sqlDialogVisible: false,
    jobsDialogVisible: false,
    releaseName: 'pdr3',
    queryRegionId: undefined,
    queueMode: false,
    noMail: true,
    draftSql: 'SELECT 1',
    jobsReloadToken: 0,
    ...overrides,
  }
}

test('falls back to the first configured release when an unknown release is selected', () => {
  const nextState = casSlice.reducer(
    makeState(),
    casSlice.actions.releaseChanged({ releaseName: 'unknown-release' }),
  )

  expect(nextState.releaseName).toBe('pdr3')
})

test('clears query region when the selected rectangle is deleted', () => {
  const state = makeState({ queryRegionId: 'region-1' })

  const nextState = casSlice.reducer(
    state,
    regionsSlice.actions.regionDeleted({ id: 'region-1' }),
  )

  expect(nextState.queryRegionId).toBeUndefined()
})
