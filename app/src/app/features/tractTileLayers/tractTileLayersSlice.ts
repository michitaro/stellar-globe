import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TractTileLayer } from "@stellar-globe/stellar-globe"
import { readHashState } from "../../store/stateSync/hashSync"


type ColorParams = ReturnType<typeof TractTileLayer.defaultParams>


type Layer = {
  name: string
  baseUrl: string
  visible: boolean
  filterNameDictionary?: { [altName: string]: string }
}


type State = {
  colorParams: ColorParams
  layers: Layer[]
}


export const filterCandidates = [
  { short: 'g', full: 'g' },
  { short: 'r', full: 'r' },
  { short: 'i', full: 'i' },
  { short: 'z', full: 'z' },
  { short: 'y', full: 'y' },
]


export const defaultFilters = filterCandidates.slice(0, 3).map(f => f.full).reverse()


const pdr3FilterNames = {
  g: 'HSC-G',
  r: 'HSC-R',
  i: 'HSC-I',
  z: 'HSC-Z',
  y: 'HSC-Y',
} as const



function layerVisible(layerName: string) {
  return (readHashState().datasets ?? [
    's23b_20231116T053220Z',
    's23b_20231120T084248Z',
    's23b_20231125T044351Z',
    // 's22a_test_step3_minIter15_alltracts_correct2_20221206T050622Z',
    'test_s22a_step3_20220721T111750Z',
    // 'test_s22a_step3_20221010T234451Z',
  ]).includes(layerName)
}


function initialState(): State {
  return {
    colorParams: readHashState().tractTileLayerColorParams ?? TractTileLayer.defaultParams({ filters: defaultFilters }),
    layers: [
      {
        name: 'PDR3 Wide',
        baseUrl: "//hscmap.mtk.nao.ac.jp/hscMap4/data/pdr3_wide",
        visible: import.meta.env.DEV,
        filterNameDictionary: pdr3FilterNames,
      },
      {
        name: 'PDR3 DUD',
        baseUrl: "//hscmap.mtk.nao.ac.jp/hscMap4/data/pdr3_dud",
        visible: import.meta.env.DEV,
        filterNameDictionary: pdr3FilterNames,
      },
      {
        name: 'Legacy Archive 2016',
        baseUrl: "//hscmap.mtk.nao.ac.jp/hscMap4/data/la2016",
        visible: false,
        filterNameDictionary: pdr3FilterNames,
      },
      ...[
        's23b_wide_20231116T053220Z',
        's23b_wide_20231120T084248Z',
        's23b_wide_20231125T044351Z',
        's22a_test_step3_minIter15_alltracts_correct2_20221206T050622Z',
        'test_s22a_step3_20220721T111750Z',
        'test_s22a_step3_20221010T234451Z',
      ].map(rerun => ({
        name: rerun,
        baseUrl: import.meta.env.DEV ? `./data/s23b_wide/${rerun}` : `../data/${rerun}`,
        // visible: !import.meta.env.DEV,
        visible: layerVisible(rerun),
      })),
    ],
  }
}


export const tractTileLayersSlice = createSlice({
  name: 'tractTileLayer',
  initialState,
  reducers: {
    colorParamsUpdated(state, { payload: { params } }: PayloadAction<{ params: ColorParams }>) {
      state.colorParams = params
    },
    toggleLayer(state, { payload: { name, visible } }: PayloadAction<{ name: string, visible: boolean }>) {
      const l = state.layers.find(l => l.name === name)
      if (l) {
        l.visible = visible
      }
    },
  },
})
