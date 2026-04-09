import hsclaCleanObjects from './sampleQueries/hscla/clean_objects.sql?raw'
import hsclaPrimaryObjects from './sampleQueries/hscla/primary_objects.sql?raw'
import internalCleanObjects from './sampleQueries/internal-release/clean_objects.sql?raw'
import internalPrimaryObjects from './sampleQueries/internal-release/primary_objects.sql?raw'
import publicRelease3CleanObjects from './sampleQueries/public-release-3/clean_objects.sql?raw'
import publicRelease3PrimaryObjects from './sampleQueries/public-release-3/primary_objects.sql?raw'

export type CasSampleQuerySetKey = 'empty' | 'hscla' | 'internal-release' | 'public-release-3'

export type CasSampleQuery = {
  id: string
  name: string
  sql: string
}

const sampleQueries: Record<CasSampleQuerySetKey, CasSampleQuery[]> = {
  empty: [],
  'hscla': [
    { id: 'primary-objects', name: 'Primary Objects', sql: hsclaPrimaryObjects },
    { id: 'clean-objects', name: 'Clean Objects', sql: hsclaCleanObjects },
  ],
  'internal-release': [
    { id: 'primary-objects', name: 'Primary Objects', sql: internalPrimaryObjects },
    { id: 'clean-objects', name: 'Clean Objects', sql: internalCleanObjects },
  ],
  'public-release-3': [
    { id: 'primary-objects', name: 'Primary Objects', sql: publicRelease3PrimaryObjects },
    { id: 'clean-objects', name: 'Clean Objects', sql: publicRelease3CleanObjects },
  ],
}

export function getCasSampleQueries(key: CasSampleQuerySetKey) {
  return sampleQueries[key]
}

export function defaultCasSql(key: CasSampleQuerySetKey) {
  return getCasSampleQueries(key)[0]?.sql ?? ''
}
