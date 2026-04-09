import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useBlockUI } from '../../../common/components/Modal'
import { AppDialog } from '../../AppDialog'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { parseCatalogCsvText } from '../catalog/catalogSlice'
import { catalogsSlice } from '../catalog/catalogSlice'
import { CasJob, cancelJob, deleteJob, downloadJob, listJobs } from './api'
import { casSlice } from './casSlice'
import styles from './dialog.module.scss'

export const CasJobsDialog = memo(() => {
  const dispatch = useAppDispatch()
  const blockUI = useBlockUI()
  const visible = useAppSelector(state => state.cas.enabled && state.cas.jobsDialogVisible)
  const refreshToken = useAppSelector(state => state.cas.jobsReloadToken)
  const [page, setPage] = useState(1)
  const [jobs, setJobs] = useState<CasJob[]>([])
  const [numPages, setNumPages] = useState(1)
  const [errorText, setErrorText] = useState<string>()

  const reload = useCallback(async () => {
    try {
      setErrorText(undefined)
      await blockUI(async () => {
        const result = await listJobs(page)
        setJobs(result.jobs)
        setNumPages(result.num_pages)
      })
    }
    catch (error) {
      setErrorText(error instanceof Error ? error.message : String(error))
    }
  }, [blockUI, page])

  useEffect(() => {
    if (visible) {
      void reload()
    }
  }, [refreshToken, reload, visible])

  const loadJob = useCallback(async (job: CasJob) => {
    try {
      await blockUI(async () => {
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
  }, [blockUI, dispatch])

  const cancel = useCallback(async (job: CasJob) => {
    try {
      await blockUI(async () => {
        await cancelJob(job.id)
      })
      await reload()
    }
    catch (error) {
      alert(error instanceof Error ? error.message : String(error))
    }
  }, [blockUI, reload])

  const remove = useCallback(async (job: CasJob) => {
    try {
      await blockUI(async () => {
        await deleteJob(job.id)
      })
      await reload()
    }
    catch (error) {
      alert(error instanceof Error ? error.message : String(error))
    }
  }, [blockUI, reload])

  const tableRows = useMemo(() => jobs.map(job => ({
    ...job,
    canLoad: job.status === 'done' && (job.out_format === 'csv' || job.out_format === 'csv.gz'),
  })), [jobs])

  return (
    <AppDialog
      title='CAS Jobs'
      visible={visible}
      onCloseButtonClick={() => dispatch(casSlice.actions.jobsDialogToggled({ open: false }))}
    >
      <div className={styles.dialogBody}>
        <div className={styles.jobsTableWrap}>
          <table className={styles.jobsTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Filesize</th>
                <th>SQL</th>
                <th>Load</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map(job => (
                <tr key={job.id} className={rowClassName(job.status)}>
                  <td>{job.id}</td>
                  <td>{job.name}</td>
                  <td>{job.status}</td>
                  <td>{prettyBytes(job.filesize)}</td>
                  <td className={styles.sqlCell} title={job.sql}>{job.sql}</td>
                  <td>
                    <button disabled={!job.canLoad} onClick={() => void loadJob(job)}>Load</button>
                  </td>
                  <td>
                    {job.status === 'running' ? (
                      <button onClick={() => void cancel(job)}>Cancel</button>
                    ) : (
                      <button onClick={() => void remove(job)}>Delete</button>
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
          <button onClick={() => setPage(current => Math.max(1, current - 1))} disabled={page <= 1}>Prev</button>
          <span>{page} / {numPages}</span>
          <button onClick={() => setPage(current => Math.min(numPages, current + 1))} disabled={page >= numPages}>Next</button>
          <span className={styles.grow} />
          <button onClick={() => void reload()}>Refresh</button>
        </div>
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
