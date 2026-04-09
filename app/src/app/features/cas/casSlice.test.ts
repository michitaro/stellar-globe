import { test } from 'vitest'
import { regionsSlice } from '../regions/regionsSlice'
import { CasState, casSlice } from './casSlice'

function makeState(overrides: Partial<CasState> = {}): CasState {
  return {
    enabled: true,
    sqlDialogVisible: false,
    jobsDialogVisible: false,
    releaseName: 'pdr3',
    rerun: 'pdr3_wide',
    queryRegionId: undefined,
    queueMode: false,
    noMail: true,
    draftSql: 'SELECT 1',
    presets: [],
    jobsReloadToken: 0,
    ...overrides,
  }
}

test('resets rerun when the selected release does not contain the current rerun', () => {
  const state = makeState({ rerun: 'invalid-rerun' })

  const nextState = casSlice.reducer(
    state,
    casSlice.actions.releaseChanged({ releaseName: 'pdr3' }),
  )

  expect(nextState.releaseName).toBe('pdr3')
  expect(nextState.rerun).toBe('pdr3_wide')
})

test('clears query region when the selected rectangle is deleted', () => {
  const state = makeState({ queryRegionId: 'region-1' })

  const nextState = casSlice.reducer(
    state,
    regionsSlice.actions.regionDeleted({ id: 'region-1' }),
  )

  expect(nextState.queryRegionId).toBeUndefined()
})
