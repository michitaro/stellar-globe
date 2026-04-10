import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { defaultCasSql, env, findCasRelease } from "../../env"
import { readStorageState } from "../../store/stateSync/StorageSync"
import { regionsSlice } from "../regions/regionsSlice"

type State = {
  enabled: boolean
  sqlDialogVisible: boolean
  jobsDialogVisible: boolean
  releaseName: string | undefined
  queryRegionId: string | undefined
  queueMode: boolean
  noMail: boolean
  draftSql: string
  jobsReloadToken: number
}

function initialState(): State {
  const config = env().cas
  const stored = readStorageState().cas
  const release = config.enabled ? findCasRelease(stored?.releaseName) : undefined

  return {
    enabled: config.enabled && config.releases.length > 0,
    sqlDialogVisible: false,
    jobsDialogVisible: false,
    releaseName: release?.name,
    queryRegionId: undefined,
    queueMode: stored?.queueMode ?? false,
    noMail: stored?.noMail ?? true,
    draftSql: stored?.draftSql ?? defaultCasSql(),
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
      const release = findCasRelease(releaseName)
      state.releaseName = release?.name
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
