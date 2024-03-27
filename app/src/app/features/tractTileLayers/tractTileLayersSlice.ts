import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TractTileLayer } from "@stellar-globe/stellar-globe"
import { readHashState } from "../../store/stateSync/hashSync"


type ColorParams = ReturnType<typeof TractTileLayer.defaultParams>


type Layer = {
  name: string
  baseUrl: string
  visible: boolean
}


type State = {
  colorParams: ColorParams
  layers: Layer[]
  toneDialogVisible: boolean
}


export const defaultFilters = ['i', 'r', 'g']


function layerVisible(layerName: string) {
  return (readHashState().datasets ?? ['PDR3 Wide', 'PDR3 DUD']).includes(layerName)
}


function initialState(): State {
  return {
    toneDialogVisible: true,
    colorParams: readHashState().tractTileLayerColorParams ?? TractTileLayer.defaultParams({ filters: defaultFilters }),
    layers: [
      {
        name: 'PDR3 Wide',
        baseUrl: "//hscmap.mtk.nao.ac.jp/hscMap4/data/pdr3_wide",
        visible: layerVisible('PDR3 Wide'),
      },
      {
        name: 'PDR3 DUD',
        baseUrl: "//hscmap.mtk.nao.ac.jp/hscMap4/data/pdr3_dud",
        visible: layerVisible('PDR3 DUD'),
      },
      // {
      //   name: 'Legacy Archive 2016',
      //   baseUrl: "//hscmap.mtk.nao.ac.jp/hscMap4/data/la2016",
      //   visible: layerVisible('Legacy Archive 2016'),
      // },
      // ...[
      //   's23b_wide_20231116T053220Z',
      //   's23b_wide_20231120T084248Z',
      //   's23b_wide_20231125T044351Z',
      //   's22a_test_step3_minIter15_alltracts_correct2_20221206T050622Z',
      //   'test_s22a_step3_20220721T111750Z',
      //   's23b_deep_step3a_20231229T123743Z',
      //   's23b_wide_step3a_20231228T070512Z',
      //   // 'test_s22a_step3_20221010T234451Z',
      // ].map(rerun => ({
      //   name: rerun,
      //   // @ts-ignore
      //   baseUrl: import.meta.env.DEV ? `./data/s23b_wide/${rerun}` : `../data/${rerun}`,
      //   // visible: !import.meta.env.DEV,
      //   // visible: layerVisible(rerun),
      //   visible: layerVisible(rerun),
      // })),
    ],
  }
}


export const tractTileLayersSlice = createSlice({
  name: 'tractTileLayers',
  initialState,
  reducers: {
    colorParamsUpdated(state, { payload: { params } }: PayloadAction<{ params: ColorParams }>) {
      state.colorParams = params
    },
    layerToggled(state, { payload: { name, visible } }: PayloadAction<{ name: string, visible: boolean }>) {
      const l = state.layers.find(l => l.name === name)
      if (l) {
        l.visible = visible
      }
    },
    toneDialogToggled(state, { payload: { open } }: PayloadAction<{ open?: boolean }>) {
      state.toneDialogVisible = open ?? !state.toneDialogVisible
    },
  },
  selectors: {
    activeLayers: createSelector(
      [
        (state: State) => state.layers,
      ],
      layers => layers.filter(l => l.visible),
    ),
  }
})
