import { useMemo, useRef } from "react"

export function useInstanceVariable<T>(make: () => T) {
  const ref = useRef(useMemo(make, [make]))
  return ref.current
}
