import { CasCredentials, ensureCasResponse, withCasCredentials } from "./auth"
import { CasPreview } from "./preview"

type RequestOptions = {
  method?: 'DELETE' | 'GET' | 'POST'
  query?: Record<string, string | number | boolean | undefined>
  body?: BodyInit | null
}

type CatalogJobRequest = {
  releaseVersion: string
  sql: string
}

export type CasPreviewResponse = {
  preview: CasPreview
  error: string | null
}

export type CasJobIndexResponse = {
  jobs: CasJob[]
  num_pages: number
}

const jobsPerPage = 10

export type CasJob = {
  id: number
  name: string
  status: string
  sql: string
  error?: string
  out_format: string
  started_at: string
  finished_at: string
  created_at: string
  updated_at: string
  include_metainfo_to_body: boolean
  download_key: string
  hidden_at: string
  mailto: string
  filesize_at_job_finish: number
  submitted_from: string
  release_version: string
  database: string
  queued_at: string
  compress: boolean
  filesize: number
}

export async function previewJob({
  releaseVersion,
  sql,
}: CatalogJobRequest) {
  return withCasCredentials(credentials =>
    requestJson<CasPreviewResponse>('/catalog_jobs', {
      method: 'POST',
      body: JSON.stringify({
        preview: true,
        catalog_job: {
          sql,
          release_version: releaseVersion,
        },
        ...credentials,
      }),
    })
  )
}

export async function enqueueJob({
  releaseVersion,
  sql,
  noMail,
}: CatalogJobRequest & { noMail: boolean }) {
  return withCasCredentials(credentials =>
    requestJson<unknown>('/catalog_jobs', {
      method: 'POST',
      body: JSON.stringify({
        catalog_job: {
          sql,
          release_version: releaseVersion,
        },
        nomail: noMail,
        ...credentials,
      }),
    })
  )
}

export async function listJobs(page = 1) {
  return withCasCredentials(() =>
    requestJson<CasJobIndexResponse>('/catalog_jobs', {
      query: {
        per: jobsPerPage,
        page,
      },
    })
  )
}

export async function cancelJob(jobId: number) {
  return withCasCredentials(credentials =>
    requestJson<unknown>(`/catalog_jobs/${jobId}/cancel`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  )
}

export async function deleteJob(jobId: number) {
  return withCasCredentials(credentials =>
    requestJson<unknown>(`/catalog_jobs/${jobId}`, {
      method: 'DELETE',
      query: credentials,
    })
  )
}

export async function downloadJob(jobId: number) {
  return withCasCredentials(() =>
    requestArrayBuffer(`/catalog_jobs/${jobId}/download`)
  )
}

async function requestJson<T>(path: string, options: RequestOptions = {}) {
  const response = await request(path, options)
  return await response.json() as T
}

async function requestArrayBuffer(path: string, options: RequestOptions = {}) {
  const response = await request(path, options)
  return await response.arrayBuffer()
}

async function request(path: string, {
  body = null,
  method = body ? 'POST' : 'GET',
  query = {},
}: RequestOptions = {}) {
  const url = new URL(`/datasearch/skymaps_api${path}`, location.origin)
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  }
  const response = await fetch(url, {
    method,
    body,
    credentials: 'include',
    headers: body ? {
      'Content-Type': 'application/json',
    } : undefined,
  })
  return ensureCasResponse(response)
}
