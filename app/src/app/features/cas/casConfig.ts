import { env } from "../../env"
import { CasSampleQuerySetKey } from "./sampleQueries"

export type CasRelease = {
  name: string
  casRelease: string
  reruns: string[]
}

export type CasConfig = {
  enabled: boolean
  releases: CasRelease[]
  sampleQuerySet: CasSampleQuerySetKey
  schemaBrowserUrl: string
}

export function casConfig(): CasConfig {
  const releases = casReleasesForTarget()
  return {
    enabled: envFlag('VITE_enableCas') && releases.length > 0,
    releases,
    sampleQuerySet: sampleQuerySetForTarget(),
    schemaBrowserUrl: 'https://hscdata.mtk.nao.ac.jp/schema_browser3/',
  }
}

export function findCasRelease(config: CasConfig, releaseName?: string) {
  return config.releases.find(release => release.name === releaseName) ?? config.releases[0]
}

function envFlag(name: keyof ImportMetaEnv) {
  const value = String(import.meta.env[name] ?? '').trim().toLowerCase()
  return value === '1' || value === 'true' || value === 'yes' || value === 'on'
}

function casReleasesForTarget() {
  switch (env().target) {
    case 'internal':
      return [
        {
          name: 'dr4',
          casRelease: 'dr4',
          reruns: ['s23b_wide', 's23b_deep', 's23b_deep2'],
        },
        {
          name: 'pdr3',
          casRelease: 'pdr3',
          reruns: ['pdr3_wide', 'pdr3_dud'],
        },
      ]
    case 'legacy-archive':
      return [
        {
          name: 'hscla2016',
          casRelease: 'hscla2016',
          reruns: ['la2016'],
        },
      ]
    case 'public':
      return [
        {
          name: 'pdr3',
          casRelease: 'pdr3',
          reruns: ['pdr3_wide', 'pdr3_dud'],
        },
      ]
    case 'u2k':
      return []
  }
}

function sampleQuerySetForTarget(): CasSampleQuerySetKey {
  switch (env().target) {
    case 'internal':
      return 'internal-release'
    case 'legacy-archive':
      return 'hscla'
    case 'public':
      return 'public-release-3'
    case 'u2k':
      return 'empty'
  }
}
