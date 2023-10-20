import { MarkerType, SkyCoord, V4, markerTypes } from '@stellar-globe/stellar-globe'
import React, { useCallback, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { CallbackMessage, MessageControllableGlobe, MessageControllableGlobeHandle } from '../../src/MessageControllableGlobe'
import { callbackDef } from '../../src/MessageControllableGlobe/MessageControlledGlobe'
import './style.scss'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


function App() {
  const ref = useRef<MessageControllableGlobeHandle>(null)
  const callback = useCallback((msg: CallbackMessage) => {
    console.log(msg)
  }, [])

  useEffect(() => {
    ref.current?.postMessage({
      type: 'setState',
      args: {
        layerDefs: [
          { type: 'GridLayer', key: '1', props: {} },
          { type: 'EsoMilkyWayLayer', key: '2', props: {} },
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
              onClick: callbackDef(0),
            }, key: '5'
          }

        ],
      },
    })
  })

  return (
    <div style={{ height: '100vh' }}>
      <MessageControllableGlobe onCallback={callback} ref={ref} />
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
