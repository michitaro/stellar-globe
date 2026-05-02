import type { AppEnv } from '../src/app/env/types.js'

export type SqlFileRef = {
  kind: 'sql-file'
  path: string
}

export type BuildCasSampleQuery = {
  id: string
  name: string
  sql: string | SqlFileRef
}

export type BuildAppEnv = Omit<AppEnv, 'cas'> & {
  cas: Omit<AppEnv['cas'], 'sampleQueries'> & {
    sampleQueries: BuildCasSampleQuery[]
  }
}

export function sqlFile(path: string, baseUrl: string): SqlFileRef {
  const resolvedUrl = new URL(path, baseUrl)
  return {
    kind: 'sql-file',
    path: resolvedUrl.href.replace('/.generated-app-config/', '/'),
  }
}
