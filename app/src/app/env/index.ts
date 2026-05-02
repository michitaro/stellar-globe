import generatedEnv from './generated.json'
import type { AppEnv, AppTarget, CasRelease } from './types'

const appEnv: AppEnv = generatedEnv

export function env(): AppEnv {
  return appEnv
}

export function findCasRelease(releaseName?: string): CasRelease | undefined {
  return env().cas.releases.find(release => release.name === releaseName) ?? env().cas.releases[0]
}

export function defaultCasSql() {
  return env().cas.sampleQueries[0]?.sql ?? ''
}

export type { AppEnv, AppTarget, CasRelease, CasSampleQuery } from './types'
