import { CSSProperties } from "react"

export type Size = {
  width: number
  height: number
}

export type Position = {
  left: number
  top: number
}

export type Rect = Position & Size

export type CSSPosition = Pick<CSSProperties, 'top' | 'left' | 'right' | 'bottom'>
export type CSSSize = Pick<CSSProperties, 'width' | 'height'>
export type CSSSizeLimit = Pick<CSSProperties, 'minWidth' | 'maxWidth' | 'minHeight' | 'maxHeight'>
