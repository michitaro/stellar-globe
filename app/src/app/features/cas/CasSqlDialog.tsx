import Editor, { OnMount } from '@monaco-editor/react'
import { editor as MonacoEditor } from 'monaco-editor'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './monaco'
import { useBlockUI } from '../../../common/components/Modal'
import { AppDialog } from '../../AppDialog'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { catalogsSlice } from '../catalog/catalogSlice'
import { RectangularRegion, Region } from '../regions/regionsSlice'
import { casConfig, findCasRelease } from './casConfig'
import { enqueueJob, previewJob } from './api'
import { casPreviewToCatalog } from './preview'
import { casSlice } from './casSlice'
import { getCasSampleQueries } from './sampleQueries'
import { expandCasSql } from './sql'
import styles from './dialog.module.scss'

export const CasSqlDialog = memo(() => {
  const dispatch = useAppDispatch()
  const blockUI = useBlockUI()
  const cas = useAppSelector(state => state.cas)
  const regions = useAppSelector(state => state.regions.regions.filter(isRectangularRegion))
  const config = casConfig()
  const release = findCasRelease(config, cas.releaseName)
  const sampleQueries = useMemo(() => getCasSampleQueries(config.sampleQuerySet), [config.sampleQuerySet])
  const visible = cas.enabled && cas.sqlDialogVisible
  const selectedRegion = regions.find(region => region.id === cas.queryRegionId)
  const [selectedPresetId, setSelectedPresetId] = useState<string>('')
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
    if (!release || !cas.rerun) {
      alert('CAS release is not configured.')
      return
    }

    const expandedSql = expandCasSql({
      sql: cas.draftSql,
      rerun: cas.rerun,
      region: selectedRegion,
    })

    clearMarkers()
    setErrorText(undefined)

    try {
      await blockUI(async () => {
        if (cas.queueMode) {
          await enqueueJob({
            releaseVersion: release.casRelease,
            sql: expandedSql,
            noMail: cas.noMail,
          })
          dispatch(casSlice.actions.jobsReloadRequested())
          dispatch(casSlice.actions.jobsDialogOpened())
          return
        }

        const result = await previewJob({
          releaseVersion: release.casRelease,
          sql: expandedSql,
        })

        if (result.error) {
          showSqlError(result.error)
          return
        }

        const preview = casPreviewToCatalog(result.preview)
        dispatch(catalogsSlice.actions.catalogAdded({
          name: `CAS ${cas.rerun}`,
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
  }, [blockUI, cas.draftSql, cas.noMail, cas.queueMode, cas.rerun, clearMarkers, dispatch, release, selectedRegion, showSqlError])

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

  const savePreset = useCallback(() => {
    const name = prompt('Preset name?')
    if (name) {
      dispatch(casSlice.actions.presetAdded({ name, sql: cas.draftSql }))
    }
  }, [cas.draftSql, dispatch])

  const loadPreset = useCallback(() => {
    const preset = cas.presets.find(item => item.id === selectedPresetId)
    if (preset) {
      dispatch(casSlice.actions.draftSqlChanged({ sql: preset.sql }))
    }
  }, [cas.presets, dispatch, selectedPresetId])

  const renamePreset = useCallback(() => {
    const preset = cas.presets.find(item => item.id === selectedPresetId)
    if (!preset) {
      return
    }
    const name = prompt('Preset name?', preset.name)
    if (name) {
      dispatch(casSlice.actions.presetRenamed({ id: preset.id, name }))
    }
  }, [cas.presets, dispatch, selectedPresetId])

  const deletePreset = useCallback(() => {
    if (selectedPresetId) {
      dispatch(casSlice.actions.presetDeleted({ id: selectedPresetId }))
      setSelectedPresetId('')
    }
  }, [dispatch, selectedPresetId])

  if (!cas.enabled) {
    return null
  }

  return (
    <AppDialog
      title='CAS SQL'
      visible={visible}
      resizable
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
            <span>Rerun</span>
            <select
              value={cas.rerun ?? ''}
              onChange={event => dispatch(casSlice.actions.rerunChanged({ rerun: event.currentTarget.value }))}
            >
              {release?.reruns.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
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
          <span className={styles.grow} />
          {sampleQueries.map(query => (
            <button key={query.id} onClick={() => dispatch(casSlice.actions.draftSqlChanged({ sql: query.sql }))}>
              {query.name}
            </button>
          ))}
          <button onClick={() => dispatch(casSlice.actions.jobsDialogOpened())}>Jobs</button>
          <button onClick={() => window.open(config.schemaBrowserUrl, '_blank', 'noopener')}>Schema</button>
        </div>

        <div className={styles.toolbar}>
          <label className={styles.toolbarLabel}>
            <span>Preset</span>
            <select value={selectedPresetId} onChange={event => setSelectedPresetId(event.currentTarget.value)}>
              <option value=''>None</option>
              {cas.presets.map(preset => (
                <option key={preset.id} value={preset.id}>{preset.name}</option>
              ))}
            </select>
          </label>
          <button onClick={loadPreset} disabled={!selectedPresetId}>Load</button>
          <button onClick={savePreset}>Save</button>
          <button onClick={renamePreset} disabled={!selectedPresetId}>Rename</button>
          <button onClick={deletePreset} disabled={!selectedPresetId}>Delete</button>
        </div>

        <div className={styles.hint}>
          矩形 region を作成して「Query CAS」から開くと、`$coord_in_selection_box` に選択範囲を展開できます。
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
