import { internalEnv } from './internal'
import { legacyArchiveEnv } from './legacyArchive'
import { publicEnv } from './public'
import type { AppEnv, AppTarget, CasRelease } from './types'
import { u2kEnv } from './u2k'

const envSet: Record<AppTarget, AppEnv> = {
  public: publicEnv,
  u2k: u2kEnv,
  'legacy-archive': legacyArchiveEnv,
  internal: internalEnv,
}

export function env(): AppEnv {
  const target = String(import.meta.env.VITE_target) as AppTarget

  if (!(target in envSet)) {
    throw new Error(`Invalid env.target: ${target}`)
  }

  return envSet[target]
}

export function findCasRelease(releaseName?: string): CasRelease | undefined {
  return env().cas.releases.find(release => release.name === releaseName) ?? env().cas.releases[0]
}

export function defaultCasSql() {
  return env().cas.sampleQueries[0]?.sql ?? ''
}

export type { AppEnv, AppTarget, CasRelease, CasSampleQuery } from './types'
