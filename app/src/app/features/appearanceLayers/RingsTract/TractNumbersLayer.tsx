import { DomLayer$, GlobeEventLayer$ } from "@stellar-globe/react-stellar-globe"
import { GlobeEventMap, V3, angle } from "@stellar-globe/stellar-globe"
import { Fragment, useCallback, useMemo, useState } from "react"
import { RingsTract } from "./RingsTract"
import styles from './styles.module.scss'

export function TractNumbersLayer() {
  const ringsTract = useMemo(() => RingsTract.numRings(120), [])
  const [tracts, setTracts] = useState<{ position: V3, index: number }[]>([])
  const [fov, setFov] = useState(99)

  const onCameraMove = useCallback((e: GlobeEventMap['camera-move-end']) => {
    const tracts: { position: V3, index: number }[] = []
    const { ra, dec } = e.skyCoord
    const i = ringsTract.d2ringIndex(dec)
    const size = 3
    for (let ii = -3; ii <= size; ++ii) {
      const iii = i + ii
      const j = ringsTract.ia2j(iii, ra)
      for (let jj = -3; jj <= size; ++jj) {
        const jjj = j + jj
        const [aaa, ddd] = ringsTract.ij2ad(iii, jjj)
        const position = angle.SkyCoord.fromRad(aaa, ddd).xyz as V3
        const index = ringsTract.ij2index(iii, jjj)
        tracts.push({ position, index })
      }
    }
    setFov(e.fovy)
    setTracts(tracts)
  }, [ringsTract])

  return (
    <Fragment>
      <GlobeEventLayer$ onCameraMove={onCameraMove} />
      {fov <= 0.2 &&
        tracts.map(({ position, index }) => (
          <DomLayer$ key={index} position={position}>
            <div className={styles.tractNumber}>{index}</div>
          </DomLayer$>
        ))
      }
    </Fragment>
  )
}
