import { afterEach, describe, expect, it, vi } from 'vitest'
import type { AppEnv } from '../../env'


function mockModules(target: AppEnv['target']) {
  const envByTarget: Record<AppEnv['target'], AppEnv> = {
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
    },
  }

  vi.doMock('../../env', () => ({
    env: () => envByTarget[target],
  }))
  vi.doMock('../../store/stateSync/hashSync', () => ({
    readHashState: () => ({}),
  }))
}


async function loadLayerNames(target: AppEnv['target']) {
  vi.resetModules()
  mockModules(target)
  const { tractTileLayersSlice } = await import('./tractTileLayersSlice')
  return tractTileLayersSlice.getInitialState().layers.map(layer => layer.name)
}


afterEach(() => {
  vi.resetModules()
  vi.doUnmock('../../env')
  vi.doUnmock('../../store/stateSync/hashSync')
})


describe('tractTileLayersSlice', () => {
  it('does not expose s23b layers on the public target', async () => {
    const layers = await loadLayerNames('public')

    expect(layers).toEqual(['PDR3 Wide', 'PDR3 DUD'])
  })

  it('keeps s23b layers on the internal target', async () => {
    const layers = await loadLayerNames('internal')

    expect(layers).toContain('s23b Wide')
    expect(layers).toContain('s23b Deep')
  })
})
