import { afterEach, describe, expect, it, vi } from 'vitest'
import type { AppEnv } from '../../env'


type MockTarget = 'public' | 'internal' | 'u2k' | 'legacy-archive'


function mockModules(target: MockTarget) {
  const envByTarget: Record<MockTarget, AppEnv> = {
    public: {
      target: 'public',
      data: {
        u2k: false,
        la2016: false,
        la2020: false,
        pdr3: true,
        idr: false,
      },
      cas: {
        enabled: true,
        releases: [],
        sampleQueries: [],
        schemaBrowserUrl: 'https://example.invalid/schema_browser3/',
      },
      tractTileLayers: {
        includeInternalLayers: false,
        defaultVisibleDatasets: ['PDR3 Wide', 'PDR3 DUD'],
      },
    },
    internal: {
      target: 'internal',
      data: {
        u2k: false,
        la2016: false,
        la2020: false,
        pdr3: false,
        idr: true,
      },
      cas: {
        enabled: true,
        releases: [],
        sampleQueries: [],
        schemaBrowserUrl: 'https://example.invalid/schema_browser3/',
      },
      tractTileLayers: {
        includeInternalLayers: true,
        defaultVisibleDatasets: ['s23b Wide', 's23b Deep'],
      },
    },
    u2k: {
      target: 'u2k',
      data: {
        u2k: true,
        la2016: false,
        la2020: false,
        pdr3: false,
        idr: false,
      },
      cas: {
        enabled: false,
        releases: [],
        sampleQueries: [],
        schemaBrowserUrl: 'https://example.invalid/schema_browser3/',
      },
      tractTileLayers: {
        includeInternalLayers: true,
        defaultVisibleDatasets: ['U2K V2'],
      },
    },
    'legacy-archive': {
      target: 'legacy-archive',
      data: {
        u2k: false,
        la2016: true,
        la2020: true,
        pdr3: false,
        idr: false,
      },
      cas: {
        enabled: true,
        releases: [],
        sampleQueries: [],
        schemaBrowserUrl: 'https://example.invalid/schema_browser3/',
      },
      tractTileLayers: {
        includeInternalLayers: true,
        defaultVisibleDatasets: ['PDR3 Wide', 'PDR3 DUD'],
      },
    },
  }

  vi.doMock('../../env', () => ({
    env: () => envByTarget[target],
  }))
  vi.doMock('../../store/stateSync/hashSync', () => ({
    readHashState: () => ({}),
  }))
}


async function loadState(target: MockTarget) {
  vi.resetModules()
  mockModules(target)
  const { tractTileLayersSlice } = await import('./tractTileLayersSlice')
  return tractTileLayersSlice.getInitialState()
}


afterEach(() => {
  vi.resetModules()
  vi.doUnmock('../../env')
  vi.doUnmock('../../store/stateSync/hashSync')
})


describe('tractTileLayersSlice', () => {
  it('does not expose s23b layers on the public target', async () => {
    const state = await loadState('public')

    expect(state.layers.map(layer => layer.name)).toEqual(['PDR3 Wide', 'PDR3 DUD'])
  })

  it('keeps s23b layers on the internal target', async () => {
    const state = await loadState('internal')

    expect(state.layers.map(layer => layer.name)).toContain('s23b Wide')
    expect(state.layers.map(layer => layer.name)).toContain('s23b Deep')
  })

  it('uses the configured default visible datasets', async () => {
    const state = await loadState('u2k')

    expect(state.layers.filter(layer => layer.visible).map(layer => layer.name)).toEqual(['U2K V2'])
  })
})
