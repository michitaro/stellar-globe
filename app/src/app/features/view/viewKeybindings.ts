import { CameraMode, Globe, angle } from "@stellar-globe/stellar-globe"
import { useMemo } from "react"
import { useAsyncPrompt } from "../../../common/components/Modal/useAsyncPrompt"
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
  const prompt = useAsyncPrompt()

  return useMemo(() => {
    const moveToCoords: Keybind = {
      action: async () => {
        const globe = globeHandle.current!()
        const { a, d } = globe.camera.center()
        const coords = await prompt('Coords?', `${a.deg} ${d.deg}`)
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

    const makeZoomKeybind = (shortcut: string, angle: number) => {
      const kb: Keybind = {
        shortcut,
        action: () => zoom(angle),
      }
      return kb
    }

    const zoomHscScale: Keybind = {
      action() {
        const vPixels = globeHandle.current!().gl.drawingBufferHeight
        const fovy = vPixels * angle.Angle.fromAsec(0.168).rad
        zoom(fovy)
      },
      shortcut: '0',
    }

    const zoomKeys = {
      zoom2arcmin: makeZoomKeybind('1', angle.Angle.fromAmin(2).rad),
      zoom20arcmin: makeZoomKeybind('2', angle.Angle.fromAmin(20).rad),
      zoom1deg: makeZoomKeybind('3', angle.Angle.fromDeg(1).rad),
      zoom2deg: makeZoomKeybind('4', angle.Angle.fromDeg(2).rad),
      zoom10deg: makeZoomKeybind('5', angle.Angle.fromDeg(10).rad),
      zoomArctan2: makeZoomKeybind('5', 2),
      zoomHscScale,
    }

    const northUp: Keybind = {
      shortcut: 'Shift+Z',
      action: () => {
        globeHandle.current?.().camera.jumpTo({ roll: 0 })
      },
    }

    const makePanKeybind = (shortcut: string, cb: (globe: Globe, dt: number) => unknown) => {
      const kb: Keybind = {
        shortcut,
        press: () => {
          const globe = globeHandle.current!()
          const a = globe.animations.add(({ dt }) => {
            cb(globe, dt)
          }, { cameraMotion: true })
          return () => {
            a.stop()
          }
        }
      }
      return kb
    }

    const cameraMoveKeys = {
      northUp,
      panLeft: makePanKeybind('ArrowLeft', (globe, dt) => globe.camera.phi += dt * globe.camera.fovy / Math.cos(globe.camera.theta) * 4.e-4),
      panRight: makePanKeybind('ArrowRight', (globe, dt) => globe.camera.phi -= dt * globe.camera.fovy / Math.cos(globe.camera.theta) * 4.e-4),
      panUp: makePanKeybind('ArrowUp', (globe, dt) => globe.camera.theta += dt * globe.camera.fovy * 4.e-4),
      panDown: makePanKeybind('ArrowDown', (globe, dt) => globe.camera.theta -= dt * globe.camera.fovy * 4.e-4),
      zoomUp: makePanKeybind('Shift+ArrowUp', (globe, dt) => globe.camera.fovy *= Math.exp(-dt * 5.e-4)),
      zoomDown: makePanKeybind('Shift+ArrowDown', (globe, dt) => globe.camera.fovy *= Math.exp(dt * 5.e-4)),
      rollClockwise: makePanKeybind('Shift+ArrowRight', (globe, dt) => globe.camera.roll -= dt * 5.e-4),
      rollCounterClockwise: makePanKeybind('Shift+ArrowLeft', (globe, dt) => globe.camera.roll += dt * 5.e-4),
    }

    return {
      moveToCoords,
      toggleFullscreen,
      toggleRetina,
      toggleProjection,
      ...zoomKeys,
      ...cameraMoveKeys,
    }
  }, [dispatch, fullscreen, globeHandle, projection, prompt])
}
