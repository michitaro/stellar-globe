import { RefObject, useCallback, useEffect, useState } from "react"


export function useFullscreen(ref: RefObject<HTMLDivElement>) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const el = ref.current!
    const cb = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    el.addEventListener('fullscreenchange', cb)
    return () => {
      el.removeEventListener('fullscreenchange', cb)
    }
  }, [ref])

  const enterFullscreen = useCallback(() => {
    ref.current?.requestFullscreen()
  }, [ref])

  const exitFullscreen = useCallback(() => {
    document.exitFullscreen()
  }, [])

  const toggleFullscreen = useCallback(() => {
    (isFullscreen ? exitFullscreen : enterFullscreen)()
  }, [enterFullscreen, exitFullscreen, isFullscreen])

  return {
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    isFullscreen,
  }
}
