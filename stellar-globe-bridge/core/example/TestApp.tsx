import { MarkerType, SkyCoord, V4, markerTypes } from "@stellar-globe/stellar-globe"
import React, { useEffect, useRef } from "react"
import { Connection, WrapperToCoreMessage } from '../src/interface'



export function TestApp() {
  const iframe = useRef<HTMLIFrameElement>(null)
  const connectionRef = useRef<ReturnType<typeof Connection>>()

  useEffect(() => {
    const w = iframe.current!.contentWindow
    connectionRef.current = Connection(w!, msg => {
      console.log(msg)
    })
  }, [])

  const postMessage = (
    msg: WrapperToCoreMessage,
    transferable?: Transferable[],
  ) => {
    return connectionRef.current!.postMessage(msg, transferable)
  }

  const clear = () => {
    postMessage({ type: 'clear', args: undefined })
  }

  const full = () => {
    postMessage({
      type: 'setState', args: {
        layerDefs: [
          { type: 'EsoMilkyWayLayer', props: {}, key: '0' },
          { type: 'SspTileLayer', props: { baseUrl: '//hscmap.mtk.nao.ac.jp/hscMap4/data/pdr3_wide', outline: true }, key: '1' },
          { type: 'ConstellationLayer', props: {}, key: '2' },
          { type: 'GridLayer', props: {}, key: '3' },
          { type: 'HipparcosCatalogLayer', props: {}, key: '4' },
          {
            type: 'ClickableMarkerLayer', props: {
              defaultColor: [1, 2, 1, 1],
              defaultType: 'circle',
              dimmAlpha: 0.75,
              markers: Array.from({ length: 1000 }, (_, i) => ({
                position: SkyCoord.fromDeg(randomInRange(-1, 1), randomInRange(-1, 1)).xyz,
                color: [...hsvToRgb(randomInRange(0, 1), 1, 1), 1] as V4,
                type: markerTypes[i % markerTypes.length] as MarkerType,
              })),
              onClick: {
                stellarglobe_bridge_callback: {
                  id: 0,
                }
              }
            }, key: '5'
          }
        ]
      }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <iframe ref={iframe} src='../' style={{ flexGrow: 1 }} />
      <form onSubmit={e => e.preventDefault()}>
        <button onClick={clear} >Clear</button>
        <button onClick={full} >Full</button>
      </form>
    </div>
  )
}


function randomInRange(min: number, max: number) {
  return (max - min) * Math.random() + min
}


function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  let r: number, g: number, b: number

  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break
    case 1: r = q, g = v, b = p; break
    case 2: r = p, g = v, b = t; break
    case 3: r = p, g = q, b = v; break
    case 4: r = t, g = p, b = v; break
    case 5: r = v, g = p, b = q; break
  }

  // @ts-ignore
  return [r, g, b]
}
