import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { AppDialog } from '../../AppDialog'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { parseCatalogCsvText } from '../catalog/catalogSlice'
import { catalogsSlice } from '../catalog/catalogSlice'
import { CasJob, CasJobIndexResponse, cancelJob, deleteJob, downloadJob, listJobs } from './api'
import { casSlice } from './casSlice'
import styles from './dialog.module.scss'

export const CasJobsDialog = memo(() => {
  const dispatch = useAppDispatch()
  const visible = useAppSelector(state => state.cas.enabled && state.cas.jobsDialogVisible)
  const refreshToken = useAppSelector(state => state.cas.jobsReloadToken)
  const [page, setPage] = useState(1)
  const [jobs, setJobs] = useState<CasJob[]>([])
  const [numPages, setNumPages] = useState(1)
  const [errorText, setErrorText] = useState<string>()
  const [busyText, setBusyText] = useState<string>()

  const runBusy = useCallback(async <T,>(text: string, action: () => Promise<T>) => {
    setBusyText(text)
    try {
      return await action()
    }
    finally {
      setBusyText(undefined)
    }
  }, [])

  const applyJobIndex = useCallback((result: CasJobIndexResponse) => {
    const nextPageCount = Math.max(result.num_pages, 1)
    setNumPages(nextPageCount)
    if (page > nextPageCount) {
      setPage(nextPageCount)
      return
    }
    setJobs(result.jobs)
  }, [page])

  const reload = useCallback(async () => {
    try {
      setErrorText(undefined)
      const result = await runBusy('Loading jobs...', () => listJobs(page))
      applyJobIndex(result)
    }
    catch (error) {
      setErrorText(error instanceof Error ? error.message : String(error))
    }
  }, [applyJobIndex, page, runBusy])

  useEffect(() => {
    if (visible) {
      void reload()
    }
  }, [refreshToken, reload, visible])

  const loadJob = useCallback(async (job: CasJob) => {
    try {
      await runBusy('Loading catalog...', async () => {
        const data = await downloadJob(job.id)
        const csvText = await arrayBufferToCsvText(data, job)
        const parsed = parseCatalogCsvText(csvText)
        dispatch(catalogsSlice.actions.catalogAdded({
          name: job.name,
          fields: parsed.fields,
          attributes: parsed.attributes,
          markers: parsed.markers,
          baseColor: parsed.baseColor,
        }))
      })
    }
    catch (error) {
      alert(error instanceof Error ? error.message : String(error))
    }
  }, [dispatch, runBusy])

  const cancel = useCallback(async (job: CasJob) => {
    try {
      const result = await runBusy('Cancelling job...', async () => {
        await cancelJob(job.id)
        return await listJobs(page)
      })
      applyJobIndex(result)
    }
    catch (error) {
      alert(error instanceof Error ? error.message : String(error))
    }
  }, [applyJobIndex, page, runBusy])

  const remove = useCallback(async (job: CasJob) => {
    try {
      const result = await runBusy('Deleting job...', async () => {
        await deleteJob(job.id)
        return await listJobs(page)
      })
      applyJobIndex(result)
    }
    catch (error) {
      alert(error instanceof Error ? error.message : String(error))
    }
  }, [applyJobIndex, page, runBusy])

  const tableRows = useMemo(() => jobs.map(job => ({
    ...job,
    canLoad: job.status === 'done' && (job.out_format === 'csv' || job.out_format === 'csv.gz'),
  })), [jobs])
  const busy = busyText !== undefined

  return (
    <AppDialog
      title='CAS Jobs'
      visible={visible}
      sizeHint={{ width: 'min(90vw, 1100px)', height: 'min(75vh, 560px)' }}
      minmaxSize={{
        minWidth: 'min(760px, 90vw)',
        minHeight: 'min(420px, 75vh)',
        maxWidth: '90vw',
        maxHeight: '75vh',
      }}
      resizable
      onCloseButtonClick={() => dispatch(casSlice.actions.jobsDialogToggled({ open: false }))}
    >
      <div className={styles.dialogBody} aria-busy={busy}>
        <div className={styles.jobsTableWrap}>
          <table className={styles.jobsTable}>
            <thead>
              <tr>
                <th className={styles.idCell}>ID</th>
                <th className={styles.nameCell}>Name</th>
                <th className={styles.statusCell}>Status</th>
                <th className={styles.filesizeCell}>Filesize</th>
                <th className={styles.sqlCell}>SQL</th>
                <th className={styles.buttonCell}>Load</th>
                <th className={styles.actionCell}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map(job => (
                <tr key={job.id} className={rowClassName(job.status)}>
                  <td className={styles.idCell}>{job.id}</td>
                  <td className={styles.nameCell} title={job.name}>{job.name}</td>
                  <td className={styles.statusCell}>{job.status}</td>
                  <td className={styles.filesizeCell}>{prettyBytes(job.filesize)}</td>
                  <td className={styles.sqlCell} title={job.sql}>{job.sql}</td>
                  <td className={styles.buttonCell}>
                    <button disabled={busy || !job.canLoad} onClick={() => void loadJob(job)}>Load</button>
                  </td>
                  <td className={styles.actionCell}>
                    {job.status === 'running' ? (
                      <button disabled={busy} onClick={() => void cancel(job)}>Cancel</button>
                    ) : (
                      <button disabled={busy} onClick={() => void remove(job)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {errorText && (
          <div className={styles.error}>{errorText}</div>
        )}

        <div className={styles.footer}>
          <button onClick={() => setPage(current => Math.max(1, current - 1))} disabled={busy || page <= 1}>Prev</button>
          <span>{page} / {numPages}</span>
          <button onClick={() => setPage(current => Math.min(numPages, current + 1))} disabled={busy || page >= numPages}>Next</button>
          <span className={styles.grow} />
          <button onClick={() => void reload()} disabled={busy}>Refresh</button>
        </div>

        {busyText && (
          <div className={styles.busyOverlay}>
            <div className={styles.busyPanel}>
              <div className={styles.spinner} />
              <div>{busyText}</div>
            </div>
          </div>
        )}
      </div>
    </AppDialog>
  )
})

function prettyBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KiB`
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GiB`
}

function rowClassName(status: string) {
  switch (status) {
    case 'running':
    case 'waiting':
    case 'starting':
      return styles.statusRunning
    case 'error':
      return styles.statusError
    case 'cancelling':
      return styles.statusCancelling
    default:
      return undefined
  }
}

async function arrayBufferToCsvText(data: ArrayBuffer, job: CasJob) {
  const needsGunzip = job.out_format === 'csv.gz' || job.compress
  if (!needsGunzip) {
    return new TextDecoder().decode(data)
  }

  if (globalThis.DecompressionStream === undefined) {
    throw new Error('This browser does not support gzip decompression.')
  }

  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('gzip'))
  return await new Response(stream).text()
}
