import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { ConstellationLayer$ } from "@stellar-globe/react-stellar-globe"


type ExtractProps<T extends (...args: never[]) => unknown> = Parameters<T>[0]


type State = {
  grid: {
    visible: boolean
  }
  esoMilkyWay: {
    visible: boolean
  }
  constellation: ExtractProps<typeof ConstellationLayer$>
  nearbyGalaxiesAndNebulas: {
    visible: true
  }
  hipparcosCatalog: {
    visible: boolean
  }
}


function initialState(): State {
  return {
    grid: {
      visible: true,
    },
    esoMilkyWay: {
      visible: true,
    },
    constellation: {
      visible: true,
      showLines: true,
      showNames: false,
      lang: 'English',
    },
    nearbyGalaxiesAndNebulas: {
      visible: true,
    },
    hipparcosCatalog: {
      visible: true,
    },
  }
}


export const appearanceLayersSlice = createSlice({
  name: 'layers',
  initialState,
  reducers: {
    visibleToggled(state, { payload: which }: PayloadAction<keyof State>) {
      state[which].visible = !state[which].visible
    },
    propsUpdated<
      Which extends keyof State,
      Props extends Partial<State[Which]>,
    >(state: State, { payload: { which, props } }: PayloadAction<{ which: Which, props: Props }>) {
      Object.assign(state[which], props)
    },
  },
})
