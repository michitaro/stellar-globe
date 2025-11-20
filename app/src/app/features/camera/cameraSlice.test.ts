import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cameraSlice, CameraParams } from './cameraSlice'

// モックの設定
vi.mock('../../store/stateSync/hashSync', () => ({
  readHashState: vi.fn().mockReturnValue({}),
}))

vi.mock('../../store/stateSync/StorageSync', () => ({
  readStorageState: vi.fn().mockReturnValue({}),
}))

describe('cameraSlice', () => {
  const initialState = cameraSlice.getInitialState()

  it('should handle initial state', () => {
    expect(initialState.projection).toBe('STEREOGRAPHIC')
    expect(initialState.retina).toBe(false)
    expect(initialState.params.fovy).toBe(2)
  })

  it('should handle projectionUpdated', () => {
    const nextState = cameraSlice.reducer(initialState, cameraSlice.actions.projectionUpdated('GNOMONIC'))
    expect(nextState.projection).toBe('GNOMONIC')
  })

  it('should handle retinaToggled', () => {
    const nextState = cameraSlice.reducer(initialState, cameraSlice.actions.retinaToggled())
    expect(nextState.retina).toBe(true)
    const nextState2 = cameraSlice.reducer(nextState, cameraSlice.actions.retinaToggled())
    expect(nextState2.retina).toBe(false)
  })

  it('should handle paramsChanged', () => {
    const newParams: CameraParams = {
      fovy: 1,
      theta: 1,
      phi: 1,
      roll: 1,
      za: 1,
      zd: 1,
      zp: 1,
    }
    const nextState = cameraSlice.reducer(initialState, cameraSlice.actions.paramsChanged(newParams))
    expect(nextState.params).toEqual(newParams)
  })
})
