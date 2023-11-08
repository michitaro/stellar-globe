import { angle } from "@stellar-globe/stellar-globe"
import { useMemo } from "react"
import { Keybind } from "../../../components/keybindings"
import { useFullscreen } from "../../../hooks/useFullscreen"
import { useAppContext } from "../../context"
import { useAppDispatch } from "../../store/hooks"
import { cameraSlice } from "../camera/cameraSlice"


export function useViewKeybindings() {
  const { globeHandle, rootElementRef } = useAppContext()
  const fullscreen = useFullscreen(rootElementRef)
  const dispatch = useAppDispatch()

  return useMemo(() => {
    const moveToCoords: Keybind = {
      action() {
        const globe = globeHandle.current!()
        const { a, d } = globe.camera.center()
        const coords = prompt('Coords?', `${a.deg} ${d.deg, 6}`)
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

    return {
      moveToCoords,
      toggleFullscreen,
      toggleRetina,
    }
  }, [dispatch, fullscreen, globeHandle])
}
