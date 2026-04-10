# CAS SQL access investigation notes

## Overview

`../old-hscmap` contains a CAS SQL client built on top of APIs under `/datasearch/skymaps_api/`. The client assumes a same-origin `datasearch` application and starts by establishing a session before calling the `catalog_jobs` endpoints.

## API

### 1. Session access token

- `GET /datasearch/skymaps_api/session/access_token?source_origin=<location.origin>`
- Response shape: `{ access_token: string }`
- The token is cached in client memory

### 2. SQL preview

- `POST /datasearch/skymaps_api/catalog_jobs`
- Request body:
  - `preview: true`
  - `catalog_job.sql`
  - `catalog_job.release_version`
  - `authenticity_token`
  - `source_origin`
- Response:
  - `preview.count`
  - `preview.fields`
  - `preview.rows`
  - `error`

### 3. Enqueue SQL job

- `POST /datasearch/skymaps_api/catalog_jobs`
- Request body:
  - `catalog_job.sql`
  - `catalog_job.release_version`
  - `nomail`
  - `authenticity_token`
  - `source_origin`

### 4. List jobs

- `GET /datasearch/skymaps_api/catalog_jobs?per=50&page=<page>`
- Response contains `jobs` and `num_pages`

### 5. Cancel a job

- `POST /datasearch/skymaps_api/catalog_jobs/:id/cancel`
- Sends `authenticity_token` and `source_origin` in the request body

### 6. Delete a job

- `DELETE /datasearch/skymaps_api/catalog_jobs/:id`
- Sends `authenticity_token` and `source_origin` as query parameters

### 7. Download job output

- `GET /datasearch/skymaps_api/catalog_jobs/:id/download`
- Retrieved as `arraybuffer` and loaded as CSV / CSV.gz catalog data

## Authentication and session handling

Authentication is centralized in `database.login()`.

1. Fetch `access_token` from `session/access_token`.
2. Pass that value as `authenticity_token` to POST / DELETE style APIs.
3. Always send `location.origin` as `source_origin`.
4. If a request returns 401, clear the cached token and retry.

Notes:

- There is a Safari workaround: if token retrieval fails, the client temporarily injects an iframe pointed at `/datasearch/` and retries with exponential backoff.
- GET endpoints such as `jobIndex()` and `downloadJob()` do not explicitly send `authenticity_token`. The wrapper is used to establish the session first, then send a normal same-origin request.
- There is no special axios `baseURL` or `withCredentials` configuration in the old implementation; it assumes same-origin access to `/datasearch/...`.

## Handling `release_version`

- SQL execution uses the release selected in the UI.
- The effective value comes from `Release.cas_release`; if not set, it falls back to the release name.
- For example, `internal-release` explicitly used `cas_release: 'dr4'` for `dr4`.

## UI behavior

- The SQL editor ships environment-specific sample queries and rewrites placeholders before submission:
  - `$rerun` → selected rerun name
  - `$coord_in_selection_box` → `boxSearch(coord, ra0, ra1, dec0, dec1)` when a selection rectangle exists, otherwise `'t'`
- Preview mode converts returned `fields` and `rows` directly into an overplotted catalog.
- Queue mode creates an async job, and the job list supports refresh, cancel, delete, and download.
- Only completed jobs with `csv` or `csv.gz` output are loadable from the job list.
- The schema reference link points to `https://hscdata.mtk.nao.ac.jp/schema_browser3/`.

## Migration considerations

- The current `app` will also need a same-origin integration path to `datasearch`.
- We should confirm whether the token fetch flow and the Safari iframe workaround are still required in the current deployment model.
- This is more than an API client. At minimum, the migration needs:
  - a SQL editor
  - preview-to-catalog conversion
  - a job list
  - release / rerun selection
  - `boxSearch` expansion from the selected sky region
