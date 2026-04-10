import hsclaCleanObjects from '../features/cas/sampleQueries/hscla/clean_objects.sql?raw'
import hsclaPrimaryObjects from '../features/cas/sampleQueries/hscla/primary_objects.sql?raw'
import internalCleanObjects from '../features/cas/sampleQueries/internal-release/clean_objects.sql?raw'
import internalPrimaryObjects from '../features/cas/sampleQueries/internal-release/primary_objects.sql?raw'
import publicRelease3CleanObjects from '../features/cas/sampleQueries/public-release-3/clean_objects.sql?raw'
import publicRelease3PrimaryObjects from '../features/cas/sampleQueries/public-release-3/primary_objects.sql?raw'
import type { CasSampleQuery } from './types'

export const publicCasSampleQueries: CasSampleQuery[] = [
  { id: 'primary-objects', name: 'Primary Objects', sql: publicRelease3PrimaryObjects },
  { id: 'clean-objects', name: 'Clean Objects', sql: publicRelease3CleanObjects },
]

export const internalCasSampleQueries: CasSampleQuery[] = [
  { id: 'primary-objects', name: 'Primary Objects', sql: internalPrimaryObjects },
  { id: 'clean-objects', name: 'Clean Objects', sql: internalCleanObjects },
]

export const legacyArchiveCasSampleQueries: CasSampleQuery[] = [
  { id: 'primary-objects', name: 'Primary Objects', sql: hsclaPrimaryObjects },
  { id: 'clean-objects', name: 'Clean Objects', sql: hsclaCleanObjects },
]
