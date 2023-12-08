import { produce } from 'immer'
import { PathLayer$, useLayerBind } from "@stellar-globe/react-stellar-globe"
import { Globe, GlobePointerDragEvent, GlobePointerEvent, Layer, MousePicker, SkyCoord, V4, glMatrix } from "@stellar-globe/stellar-globe"
import { Fragment, memo, useCallback, useMemo, useRef } from "react"
import { slerp } from "../../../utils/math"
import { setDisplayName } from "../../../utils/setDisplayName"
const { mat3, vec3 } = glMatrix


export type LineDef = {
  start: SkyCoord
  end: SkyCoord
}

type Props = {
  lineDef: LineDef
  color: V4
  visible: boolean
  onChange?: (lineDef: LineDef) => void
}

export const LinearRegionLayer = memo(({
  lineDef,
  color,
  visible,
  onChange,
}: Props) => {
  type Paths = Parameters<typeof PathLayer$>[0]['paths']

  const paths = useMemo(() => {
    const { start, end } = lineDef
    const a = start
    const b = end
    const div = Math.floor(5 * a.angle(b).deg) + 1
    const paths: Paths = [
      {
        close: false,
        joint: 'NONE',
        points: Array.from({ length: div + 1 }, (_, i) => ({
          color,
          position: slerp(a.xyz, b.xyz, i / div),
          size: 0,
        })),
      },
    ]
    return paths
  }, [lineDef, color])

  return (
    <Fragment>
      <PathLayer$
        paths={paths}
        visible={visible}
        blendMode="NORMAL"
        dimOnZoom={false}
        darkenNarrowLine={false} />
      <MouseLayer$ lineDef={lineDef} onChagne={onChange} />
    </Fragment>
  )
})
setDisplayName({ LinearRegionLayer })



class MouseLayer extends Layer {
  constructor(
    globe: Globe,
    lineDef: LineDef,
    onChange?: (lineDef: LineDef) => void,
  ) {
    super(globe)

    class LineBodyPicker extends MousePicker {
      hit(e: GlobePointerEvent): { hit: boolean; passThrough: boolean } {
        const lineWidth = 5
        const { start, end } = lineDef
        const p = e.coord.xyz
        const a = start.xyz
        const b = end.xyz
        const c = vec3.cross(vec3.create(), a, b)
        vec3.normalize(c, c)
        // console.log([...a, ...b, ...c])
        // @ts-ignore
        const A = mat3.fromValues(...a, ...b, ...c)
        if (mat3.determinant(A) === 0.) {
          return { hit: false, passThrough: false }
        }
        const B = mat3.invert(mat3.create(), A)
        const q = vec3.transformMat3(vec3.create(), p, B)
        const d = 0.01 // globe.camera.fovy * lineWidth / globe.gl.drawingBufferHeight
        const hit = q[0] >= 0 && q[1] >= 0 && Math.abs(q[2]) <= d
        console.log(hit)
        return { hit, passThrough: false }
      }

      protected onDrag(e: GlobePointerDragEvent): void {
        const newDef = produce(lineDef, _ => {
          _.end = e.coord
        })
        console.log(newDef)
        onChange?.(newDef)
      }
    }

    this.mousePickers.push(new LineBodyPicker())
  }
}


function MouseLayer$({
  lineDef,
  onChagne,
}: {
  lineDef: LineDef,
  onChagne?: (lineDef: LineDef) => void
}) {
  const initialLineDef = useRef(lineDef)
  const factory = useCallback((globe: Globe) => new MouseLayer(globe, initialLineDef.current, onChagne), [onChagne])
  const { node } = useLayerBind(factory, true)
  return node
}
