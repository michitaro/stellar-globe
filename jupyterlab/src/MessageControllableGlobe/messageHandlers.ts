import { SkyCoord, angle } from "@stellar-globe/stellar-globe"
import { LayerDef, MessageControllableGlobeContextType } from "."
import { assertLayerProps } from "../TypeGuard"


// eslint-disable-next-line @typescript-eslint/ban-types
function clear({ setLayerDefs }: MessageControllableGlobeContextType, args: {}) {
  setLayerDefs([])
}

type UnvalidatedLayerDef = {
  type: string
  props: any
  key: string
}

function setState({ setLayerDefs }: MessageControllableGlobeContextType, args: { layerDefs: UnvalidatedLayerDef[] }) {
  args.layerDefs.forEach(d => {
    // @ts-ignore
    assertLayerProps(d.type, d.props)
  })
  // @ts-ignore
  const layerDefs: LayerDef[] = args.layerDefs
  setLayerDefs(layerDefs)
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
    fovy: fov && angle.deg2rad(fov),
    roll: roll && angle.deg2rad(roll),
  }, {
    coord: SkyCoord.fromDeg(ra, dec),
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
