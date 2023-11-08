import { SkyCoord } from "@stellar-globe/stellar-globe"
import { produce } from 'immer'
import { LayerDef, MessageControllableGlobeContextType, State } from "."
import { assertLayerProps } from "../TypeGuard"


function clear({ setState }: MessageControllableGlobeContextType, args: {}) {
  setState(produce(_ => {
    _.layerDefs = []
  }))
}

type UnvalidatedLayerDef = {
  type: string
  props: any
  key: string
}

type UnvalidatedState = Omit<State, "layerDefs"> & { layerDefs: UnvalidatedLayerDef[] }

function setState({ setState }: MessageControllableGlobeContextType, args: UnvalidatedState) {
  args.layerDefs.forEach(d => {
    // @ts-ignore
    assertLayerProps(d.type, d.props)
  })
  // @ts-ignore
  const layerDefs: LayerDef[] = args.layerDefs
  setState(produce(_ => {
    _.layerDefs = layerDefs
  }))
}

function jumpTo({ getGlobe }: MessageControllableGlobeContextType, args: {
  ra: number,
  dec: number,
  fov?: number,
  roll?: number,
  duration?: number,
}) {
  const { ra, dec, fov, roll, duration } = args
  const globe = getGlobe()!
  globe.camera.jumpTo({
    fovy: fov,
    roll: roll,
  }, {
    coord: SkyCoord.fromRad(ra, dec),
    duration,
  })
}

export const messageHandlers = {
  clear,
  setState,
  jumpTo,
}

type MessageTypes = keyof typeof messageHandlers

export type MessageToStellarGlobeMap = {
  [K in MessageTypes]: {
    type: K
    args: Parameters<(typeof messageHandlers)[K]>[1]
  }
}

export type MessageToStellarGlobe = {
  [K in MessageTypes]: {
    type: K
    args: Parameters<(typeof messageHandlers)[K]>[1]
  }
}[MessageTypes]
