import { test } from 'vitest'
import { normalizeStorageState } from './StorageSync'

test('normalizes legacy CAS storage fields before validation', () => {
  const normalized = normalizeStorageState({
    cas: {
      releaseName: 'pdr3',
      rerun: 'pdr3_wide',
      presets: [{ id: 'legacy', name: 'Legacy', sql: 'SELECT 1' }],
      queueMode: true,
      noMail: false,
      draftSql: 'SELECT 1',
    },
  })

  expect(normalized).toEqual({
    cas: {
      releaseName: 'pdr3',
      queueMode: true,
      noMail: false,
      draftSql: 'SELECT 1',
    },
  })
})
