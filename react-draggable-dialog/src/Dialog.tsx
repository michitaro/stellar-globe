import { DndContext, KeyboardSensor, useDraggable, useSensor, useSensors } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import { DragEndEvent } from "@dnd-kit/core/dist/types"
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import classNames from 'classnames'
import { CSSProperties, ReactNode, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import CSSTransition, { CSSTransitionClassNames } from 'react-transition-group/CSSTransition'
import { useDialogContext, useZIndex } from './Context'
import { Resizable } from './Resizable'
import { PointerSensor } from './dnd'
import { useSeqId } from './hooks'
import styles from './styles.module.scss'
import { Position, Size } from './types'


export type DialogProps = {
  title: ReactNode
  children: ReactNode
  resizable?: boolean
  positionHint?: CSSPosition
  sizeHint?: CSSSize
  classNames: ClassNames
  visible?: boolean
  fadeDuration?: number
  fadeClassNames?: CSSTransitionClassNames
  rememberPosition?: boolean
  minSize?: Size
}


type CSSPosition = Pick<CSSProperties, 'top' | 'left' | 'right' | 'bottom'>
type CSSSize = Pick<CSSProperties, 'width' | 'height'>


type ClassNames = {
  dialog?: string
  titlebar?: string
  content?: string
  active?: string
}


export function Dialog(props: DialogProps) {
  const { portal } = useDialogContext()
  if (portal) {
    return createPortal(<PortalContent {...props} />, portal)
  }
  else {
    return <PortalContent {...props} />
  }
}


// DndContext and Draggable must be separate components
function PortalContent(props: DialogProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  )
  const [position, setPosition] = useState<Position | undefined>(undefined)
  const positionAtDragStart = useRef<Position | undefined>()
  const onDragStart = useCallback(({ active: { data } }: DragEndEvent) => {
    const sizeRef: React.RefObject<HTMLDivElement> = data.current?.sizeRef
    const { left, top } = sizeRef.current!.getBoundingClientRect()
    positionAtDragStart.current = { left, top }
  }, [])
  const onDragEnd = useCallback(({ delta }: DragEndEvent) => {
    setPosition(() => {
      if (positionAtDragStart.current) {
        const { left, top } = positionAtDragStart.current
        return {
          left: left + delta.x,
          top: top + delta.y,
        }
      }
    })
  }, [])
  return (
    <DndContext
      sensors={sensors}
      onDragStart={(onDragStart)}
      onDragEnd={onDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <DnDContent {...{ ...props, }} position={position} setPosition={setPosition} />
    </DndContext>
  )
}


export function DnDContent({
  children,
  title,
  classNames: $classNames,
  position,
  positionHint,
  sizeHint,
  setPosition,
  visible = true,
  fadeClassNames,
  fadeDuration = 0,
  rememberPosition = false,
  minSize,
}: DialogProps & {
  position: Position | undefined
  setPosition: React.Dispatch<React.SetStateAction<Position | undefined>>
}) {
  const id = useSeqId()
  const zIndex = useZIndex(id)
  const wrapperRef = useRef<HTMLDivElement>(null!)
  const sizeRef = useRef<HTMLDivElement>(null!)
  const [size, setSize] = useState<Size | undefined>(undefined)

  const { setNodeRef, listeners, transform, attributes, setActivatorNodeRef, active } = useDraggable({
    id: 'dialog',
    data: { sizeRef },
  })

  const style = useMemo(() => {
    const positionStyle: CSSProperties = {
      ...(
        position
          ? {
            left: `${position.left}px`,
            top: `${position.top}px`,
          }
          : positionHint
      ),
      transform: CSS.Translate.toString(transform)
    }

    const sizeStyle: CSSProperties | undefined = size ?
      {
        width: `${size.width}px`,
        height: `${size.height}px`,
      } : sizeHint

    return { ...positionStyle, ...sizeStyle, zIndex }
  }, [position, positionHint, size, sizeHint, transform, zIndex])

  const { dialogs, nextPosition, raiseWindow } = useDialogContext()

  useLayoutEffect(() => {
    // 大きさはchildren, titleにもよる
    children
    title
    if (visible) {
      // 初回commit時などpositionが未指定の状態ではpositionHintによって場所が決まっている。
      const { width, height, left, top } = sizeRef.current.getBoundingClientRect()
      if (!position) {
        const newPosition = nextPosition({ width, height }, { positionHint: positionHint && { left, top } })
        setPosition(newPosition)
        dialogs.set(id, { rect: { ...newPosition, width, height }, visible })
      }
      else {
        dialogs.set(id, { rect: { left, top, width, height }, visible })
      }
      return () => {
        dialogs.delete(id)
      }
    }
  }, [children, dialogs, id, nextPosition, position, positionHint, setPosition, title, visible])

  const onExited = useCallback(() => {
    if (!rememberPosition) {
      setPosition(undefined)
    }
  }, [rememberPosition, setPosition])

  return (
    <CSSTransition
      nodeRef={wrapperRef}
      in={visible}
      timeout={fadeDuration}
      classNames={fadeClassNames}
      mountOnEnter
      appear
      onExited={onExited}
    >
      <div ref={sizeRef} style={{ ...style, position: 'fixed' }}>
        <Resizable container={sizeRef} position={position} setPosition={setPosition} setSize={setSize} minSize={minSize}>
          <div className={styles.wrapper} ref={wrapperRef} onMouseDown={() => raiseWindow(id)}>
            <div
              className={classNames(styles.dialog, $classNames.dialog, active && $classNames.active)}
              ref={setNodeRef}
            >
              <div
                className={classNames(styles.titlebar, $classNames.titlebar)}
                ref={setActivatorNodeRef}
                {...listeners}
                {...attributes}
              >
                {title}
              </div>
              <div
                className={classNames(styles.content, $classNames.content)}
              >
                {children}
              </div>
            </div >
          </div>
        </Resizable>
      </div>
    </CSSTransition>
  )
}
