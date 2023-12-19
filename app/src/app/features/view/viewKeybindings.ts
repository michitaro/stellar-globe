import { CameraMode, angle, hips } from "@stellar-globe/stellar-globe"
import { useMemo } from "react"
import { Keybind } from "../../../common/components/keybindings"
import { useFullscreen } from "../../../common/hooks/useFullscreen"
import { useAppContext } from "../../context"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { cameraSlice } from "../camera/cameraSlice"


export function useViewKeybindings() {
  const { globeHandle, rootElementRef } = useAppContext()
  const projection = useAppSelector(state => state.camera.projection)
  const fullscreen = useFullscreen(rootElementRef)
  const dispatch = useAppDispatch()

  return useMemo(() => {
    const moveToCoords: Keybind = {
      action() {
        const globe = globeHandle.current!()
        const { a, d } = globe.camera.center()
        const coords = prompt('Coords?', `${a.deg} ${d.deg}`)
        if (coords) {
          const skyCoord = angle.SkyCoord.parse(coords)
          globe.camera.jumpTo({}, { coord: skyCoord })
        }
      },
      shortcut: 'Ctrl+G',
    }

    const toggleFullscreen: Keybind = {
      action() {
        fullscreen.toggleFullscreen()
      },
      shortcut: 'F',
    }

    const toggleRetina: Keybind = {
      action() {
        dispatch(cameraSlice.actions.retinaToggled())
      },
      shortcut: 'Ctrl+R',
    }

    const toggleProjection: Keybind = {
      action() {
        const map: { [K in CameraMode]: CameraMode } = {
          GNOMONIC: 'STEREOGRAPHIC',
          STEREOGRAPHIC: 'FLOATING_EYE',
          FLOATING_EYE: 'GNOMONIC',
        }
        const next: CameraMode = map[projection]
        dispatch(cameraSlice.actions.projectionUpdated(next))
      },
      shortcut: 'Z',
    }

    const zoom = (fovy: number) => {
      globeHandle.current?.().camera.jumpTo({ fovy })
    }

    const zoom2arcmin: Keybind = {
      action() {
        zoom(angle.Angle.fromAmin(2).rad)
      },
      shortcut: '1',
    }

    const zoom20arcmin: Keybind = {
      action() {
        zoom(angle.Angle.fromAmin(20).rad)
      },
      shortcut: '2',
    }

    const zoom1deg: Keybind = {
      action() {
        zoom(angle.Angle.fromDeg(1).rad)
      },
      shortcut: '3',
    }

    const zoom2deg: Keybind = {
      action() {
        zoom(angle.Angle.fromDeg(2).rad)
      },
      shortcut: '4',
    }

    const zoomArctan2: Keybind = {
      action() {
        zoom(2)
      },
      shortcut: '5',
    }

    const zoomHscScale: Keybind = {
      action() {
        const vPixels = globeHandle.current!().gl.drawingBufferHeight
        const fovy = vPixels * angle.Angle.fromAsec(0.168).rad
        zoom(fovy)
      },
      shortcut: '0',
    }

    return {
      moveToCoords,
      toggleFullscreen,
      toggleRetina,
      toggleProjection,
      zoom2arcmin,
      zoom20arcmin,
      zoom1deg,
      zoom2deg,
      zoomArctan2,
      zoomHscScale,
    }
  }, [dispatch, fullscreen, globeHandle, projection])
}
