import { MenuDivider, MenuItem, SubMenu } from '@szhsin/react-menu'
import Editor, { OnMount } from '@monaco-editor/react'
import { editor as MonacoEditor } from 'monaco-editor'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './monaco'
import { useBlockUI } from '../../../common/components/Modal'
import { AppDialog } from '../../AppDialog'
import { env, findCasRelease } from '../../env'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { catalogsSlice } from '../catalog/catalogSlice'
import { RectangularRegion, Region } from '../regions/regionsSlice'
import { enqueueJob, previewJob } from './api'
import { casPreviewToCatalog } from './preview'
import { casSlice } from './casSlice'
import { expandCasSql } from './sql'
import styles from './dialog.module.scss'

export const CasSqlDialog = memo(() => {
  const dispatch = useAppDispatch()
  const blockUI = useBlockUI()
  const cas = useAppSelector(state => state.cas)
  const regions = useAppSelector(state => state.regions.regions.filter(isRectangularRegion))
  const config = env().cas
  const release = findCasRelease(cas.releaseName)
  const sampleQueries = config.sampleQueries
  const visible = cas.enabled && cas.sqlDialogVisible
  const selectedRegion = regions.find(region => region.id === cas.queryRegionId)
  const [errorText, setErrorText] = useState<string>()
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null)
  const submitRef = useRef<() => Promise<void>>(async () => { })

  const clearMarkers = useCallback(() => {
    const editor = editorRef.current
    const monaco = monacoRef.current
    const model = editor?.getModel()
    if (editor && monaco && model) {
      monaco.editor.setModelMarkers(model, 'cas', [])
    }
  }, [])

  const showSqlError = useCallback((message: string) => {
    setErrorText(message)
    const editor = editorRef.current
    const monaco = monacoRef.current
    const model = editor?.getModel()
    if (!editor || !monaco || !model) {
      return
    }

    const marker = sqlErrorMarker(message, model, monaco)
    monaco.editor.setModelMarkers(model, 'cas', marker ? [marker] : [])
  }, [])

  const submit = useCallback(async () => {
    if (!release) {
      alert('CAS release is not configured.')
      return
    }

    const expandedSql = expandCasSql({
      sql: cas.draftSql,
      region: selectedRegion,
    })

    clearMarkers()
    setErrorText(undefined)

    try {
      await blockUI(async () => {
        if (cas.queueMode) {
          await enqueueJob({
            releaseVersion: release.name,
            sql: expandedSql,
            noMail: cas.noMail,
          })
          dispatch(casSlice.actions.jobsReloadRequested())
          dispatch(casSlice.actions.jobsDialogOpened())
          return
        }

        const result = await previewJob({
          releaseVersion: release.name,
          sql: expandedSql,
        })

        if (result.error) {
          showSqlError(result.error)
          return
        }

        const preview = casPreviewToCatalog(result.preview)
        dispatch(catalogsSlice.actions.catalogAdded({
          name: `CAS ${release.name}`,
          fields: preview.fields,
          attributes: preview.attributes,
          markers: preview.markers,
          baseColor: preview.baseColor,
        }))

        if (result.preview.count > preview.attributes.length) {
          alert(`Only top ${preview.attributes.length} records are fetched. Use "Queue" mode to retrieve all records.`)
        }
      })
    }
    catch (error) {
      alert(error instanceof Error ? error.message : String(error))
    }
  }, [blockUI, cas.draftSql, cas.noMail, cas.queueMode, clearMarkers, dispatch, release, selectedRegion, showSqlError])

  submitRef.current = submit

  const onEditorMount = useCallback<OnMount>((editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      void submitRef.current()
    })
  }, [])

  useEffect(() => {
    if (visible) {
      editorRef.current?.layout()
      editorRef.current?.focus()
    }
  }, [visible])

  const openSchemaBrowser = useCallback(() => {
    window.open(config.schemaBrowserUrl, '_blank', 'noopener')
  }, [config.schemaBrowserUrl])

  const menu = useMemo(() => (
    <>
      <MenuItem onClick={() => dispatch(casSlice.actions.jobsDialogOpened())}>Jobs</MenuItem>
      <MenuItem onClick={openSchemaBrowser}>Schema Browser</MenuItem>
      <MenuDivider />
      <SubMenu label='Sample Queries'>
        {sampleQueries.length > 0 ? sampleQueries.map(query => (
          <MenuItem
            key={query.id}
            onClick={() => dispatch(casSlice.actions.draftSqlChanged({ sql: query.sql }))}
          >
            {query.name}
          </MenuItem>
        )) : (
          <MenuItem disabled>No sample queries</MenuItem>
        )}
      </SubMenu>
    </>
  ), [dispatch, openSchemaBrowser, sampleQueries])

  if (!cas.enabled) {
    return null
  }

  return (
    <AppDialog
      title='CAS SQL'
      visible={visible}
      resizable
      sizeHint={{ width: 'min(90vw, 1100px)', height: 'min(75vh, 720px)' }}
      minmaxSize={{
        minWidth: 'min(640px, 90vw)',
        minHeight: 'min(420px, 75vh)',
        maxWidth: '90vw',
        maxHeight: '75vh',
      }}
      menu={menu}
      onCloseButtonClick={() => dispatch(casSlice.actions.sqlDialogToggled({ open: false }))}
    >
      <div className={styles.dialogBody}>
        <div className={styles.toolbar}>
          {config.releases.length > 1 && (
            <label className={styles.toolbarLabel}>
              <span>Release</span>
              <select
                value={release?.name ?? ''}
                onChange={event => dispatch(casSlice.actions.releaseChanged({ releaseName: event.currentTarget.value }))}
              >
                {config.releases.map(item => (
                  <option key={item.name} value={item.name}>{item.name}</option>
                ))}
              </select>
            </label>
          )}
          <label className={styles.toolbarLabel}>
            <span>Region</span>
            <select
              value={cas.queryRegionId ?? ''}
              onChange={event => dispatch(casSlice.actions.queryRegionChanged({ queryRegionId: event.currentTarget.value || undefined }))}
            >
              <option value=''>None</option>
              {regions.map((region, index) => (
                <option key={region.id} value={region.id}>{regionLabel(region, index)}</option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.hint}>
          Create a rectangular region and open CAS from “Query CAS” to expand `$coord_in_selection_box` to that selection.
        </div>

        <div className={styles.editor}>
          <Editor
            theme='vs-dark'
            language='sql'
            value={cas.draftSql}
            onChange={value => dispatch(casSlice.actions.draftSqlChanged({ sql: value ?? '' }))}
            onMount={onEditorMount}
            options={{
              automaticLayout: true,
              minimap: { enabled: false },
              fontSize: 13,
              tabSize: 4,
              wordWrap: 'on',
            }}
          />
        </div>

        {errorText && (
          <div className={styles.error}>{errorText}</div>
        )}

        <div className={styles.footer}>
          <label className={styles.toolbarLabel}>
            <input
              type='checkbox'
              checked={cas.noMail}
              disabled={!cas.queueMode}
              onChange={event => dispatch(casSlice.actions.noMailChanged({ noMail: event.currentTarget.checked }))}
            />
            <span>No Mail</span>
          </label>
          <label className={styles.toolbarLabel}>
            <input
              type='checkbox'
              checked={cas.queueMode}
              onChange={event => dispatch(casSlice.actions.queueModeChanged({ queueMode: event.currentTarget.checked }))}
            />
            <span>Queue</span>
          </label>
          <span className={styles.grow} />
          <button onClick={() => void submit()}>Submit (Ctrl+Enter)</button>
        </div>
      </div>
    </AppDialog>
  )
})

function isRectangularRegion(region: Region): region is RectangularRegion {
  return region.type === 'Rectangular'
}

function regionLabel(region: RectangularRegion, index: number) {
  if (region.name.trim()) {
    return region.name
  }
  return `Rect ${index + 1} (${rad2deg(region.minRa).toFixed(2)}, ${rad2deg(region.minDec).toFixed(2)})`
}

function rad2deg(value: number) {
  return value * 180 / Math.PI
}

function sqlErrorMarker(
  message: string,
  model: MonacoEditor.ITextModel,
  monaco: typeof import('monaco-editor'),
): MonacoEditor.IMarkerData | undefined {
  const match = message.match(/^ERROR:\s+(.*?)\n(LINE\s+(\d+):)(.*)\n(.*)(?:\nHINT:\s+(.*))?/)
  if (!match) {
    return
  }

  const lineNumber = Number(match[3])
  const line = model.getLineContent(lineNumber)
  if (!line) {
    return
  }

  const hint = match[6]
  return {
    severity: monaco.MarkerSeverity.Error,
    message: hint ? `${match[1]}\nHint: ${hint}` : match[1],
    startLineNumber: lineNumber,
    startColumn: 1,
    endLineNumber: lineNumber,
    endColumn: line.length + 1,
  }
}
