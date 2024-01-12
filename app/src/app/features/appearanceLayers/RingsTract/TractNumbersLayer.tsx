import { DomLayer$ } from "@stellar-globe/react-stellar-globe"
import { V3, angle } from "@stellar-globe/stellar-globe"
import { Fragment, useMemo } from "react"
import { useAppSelector } from "../../../store/hooks"
import { cameraSlice } from "../../camera/cameraSlice"
import { RingsTract } from "./RingsTract"
import styles from './styles.module.scss'

export function TractNumbersLayer() {
  const ringsTract = useMemo(() => RingsTract.numRings(120), [])
  const { fovy } = useAppSelector(state => state.camera.params)
  const center = useAppSelector(cameraSlice.selectors.center)

  const tracts = useMemo(() => {
    const { a, d } = center
    const tracts: { position: V3, index: number }[] = []
    const i = ringsTract.d2ringIndex(d.rad)
    const size = 3
    for (let ii = -3; ii <= size; ++ii) {
      const iii = i + ii
      const j = ringsTract.ia2j(iii, a.rad)
      for (let jj = -3; jj <= size; ++jj) {
        const jjj = j + jj
        const [aaa, ddd] = ringsTract.ij2ad(iii, jjj)
        const position = angle.SkyCoord.fromRad(aaa, ddd).xyz as V3
        const index = ringsTract.ij2index(iii, jjj)
        tracts.push({ position, index })
      }
    }
    return tracts
  }, [center, ringsTract])

  return (
    <Fragment>
      {fovy <= 0.2 &&
        tracts.map(({ position, index }) => (
          <DomLayer$ key={index} position={position}>
            <div className={styles.tractNumber}>{index}</div>
          </DomLayer$>
        ))
      }
    </Fragment>
  )
}
