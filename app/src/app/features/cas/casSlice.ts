import { PayloadAction, createSlice, nanoid } from "@reduxjs/toolkit"
import { readStorageState } from "../../store/stateSync/StorageSync"
import { regionsSlice } from "../regions/regionsSlice"
import { casConfig, findCasRelease } from "./casConfig"
import { defaultCasSql } from "./sampleQueries"

export type CasPreset = {
  id: string
  name: string
  sql: string
}

type State = {
  enabled: boolean
  sqlDialogVisible: boolean
  jobsDialogVisible: boolean
  releaseName: string | undefined
  rerun: string | undefined
  queryRegionId: string | undefined
  queueMode: boolean
  noMail: boolean
  draftSql: string
  presets: CasPreset[]
  jobsReloadToken: number
}

function initialState(): State {
  const config = casConfig()
  const stored = readStorageState().cas
  const release = findCasRelease(config, stored?.releaseName)
  const rerun = release?.reruns.includes(stored?.rerun ?? '') ? stored?.rerun : release?.reruns[0]

  return {
    enabled: config.enabled,
    sqlDialogVisible: false,
    jobsDialogVisible: false,
    releaseName: release?.name,
    rerun,
    queryRegionId: undefined,
    queueMode: stored?.queueMode ?? false,
    noMail: stored?.noMail ?? true,
    draftSql: stored?.draftSql ?? defaultCasSql(config.sampleQuerySet),
    presets: stored?.presets ?? [],
    jobsReloadToken: 0,
  }
}

export const casSlice = createSlice({
  name: 'cas',
  initialState,
  reducers: {
    sqlDialogToggled(state, { payload: { open } }: PayloadAction<{ open?: boolean }>) {
      if (state.enabled) {
        state.sqlDialogVisible = open ?? !state.sqlDialogVisible
      }
    },
    jobsDialogToggled(state, { payload: { open } }: PayloadAction<{ open?: boolean }>) {
      if (state.enabled) {
        state.jobsDialogVisible = open ?? !state.jobsDialogVisible
      }
    },
    sqlDialogOpened(state, { payload: { queryRegionId } }: PayloadAction<{ queryRegionId?: string }>) {
      if (state.enabled) {
        state.sqlDialogVisible = true
        state.queryRegionId = queryRegionId
      }
    },
    jobsDialogOpened(state) {
      if (state.enabled) {
        state.jobsDialogVisible = true
      }
    },
    releaseChanged(state, { payload: { releaseName } }: PayloadAction<{ releaseName: string }>) {
      const release = findCasRelease(casConfig(), releaseName)
      state.releaseName = release?.name
      if (!release?.reruns.includes(state.rerun ?? '')) {
        state.rerun = release?.reruns[0]
      }
    },
    rerunChanged(state, { payload: { rerun } }: PayloadAction<{ rerun: string }>) {
      state.rerun = rerun
    },
    queryRegionChanged(state, { payload: { queryRegionId } }: PayloadAction<{ queryRegionId?: string }>) {
      state.queryRegionId = queryRegionId
    },
    queueModeChanged(state, { payload: { queueMode } }: PayloadAction<{ queueMode: boolean }>) {
      state.queueMode = queueMode
    },
    noMailChanged(state, { payload: { noMail } }: PayloadAction<{ noMail: boolean }>) {
      state.noMail = noMail
    },
    draftSqlChanged(state, { payload: { sql } }: PayloadAction<{ sql: string }>) {
      state.draftSql = sql
    },
    presetAdded: {
      prepare(payload: { name: string, sql: string }) {
        return {
          payload: {
            id: nanoid(),
            ...payload,
          },
        }
      },
      reducer(state, { payload }: PayloadAction<CasPreset>) {
        state.presets.push(payload)
      },
    },
    presetDeleted(state, { payload: { id } }: PayloadAction<{ id: string }>) {
      state.presets = state.presets.filter(preset => preset.id !== id)
    },
    presetRenamed(state, { payload: { id, name } }: PayloadAction<{ id: string, name: string }>) {
      const preset = state.presets.find(item => item.id === id)
      if (preset) {
        preset.name = name
      }
    },
    jobsReloadRequested(state) {
      state.jobsReloadToken += 1
    },
  },
  extraReducers(builder) {
    builder.addCase(regionsSlice.actions.regionDeleted, (state, { payload: { id } }) => {
      if (state.queryRegionId === id) {
        state.queryRegionId = undefined
      }
    })
  },
})

export type CasState = State
