import { DndContext, KeyboardSensor, useDraggable, useSensor, useSensors } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import { DragEndEvent } from "@dnd-kit/core/dist/types"
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import classNames from 'classnames'
import { CSSProperties, ReactNode, RefObject, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import CSSTransition, { CSSTransitionClassNames } from 'react-transition-group/CSSTransition'
import { useDialogContext } from './Context'
import { Resizable } from './Resizable'
import { PointerSensor } from './dnd'
import { useSeqId } from './hooks'
import styles from './styles.module.scss'
import { CSSPosition, CSSSize, CSSSizeLimit, Position, Size } from './types'


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
  minmaxSize?: CSSSizeLimit
}


type ClassNames = {
  dialog?: string
  titlebar?: string
  content?: string
  active?: string
}


export function Dialog(props: DialogProps) {
  const { portal } = useDialogContext()
  if (portal) {
    return createPortal(<DialogDraggable {...props} />, portal)
  }
  else {
    return <DialogDraggable {...props} />
  }
}



function DialogDraggable(props: DialogProps) {
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


function DnDContent({
  children,
  title,
  classNames: $classNames,
  position,
  positionHint: intrinsicPositionHint,
  sizeHint,
  setPosition,
  visible = true,
  fadeClassNames,
  fadeDuration = 0,
  rememberPosition = false,
  resizable = false,
  minmaxSize,
}: DialogProps & {
  position: Position | undefined
  setPosition: React.Dispatch<React.SetStateAction<Position | undefined>>
}) {
  const id = useSeqId()
  const zIndex = useZIndex(id)
  const sizeRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<Size | undefined>(undefined)
  const { raiseDialog, defaultPositionHint, portal } = useDialogContext()
  const positionHint = intrinsicPositionHint ?? defaultPositionHint

  usePositionRegistry({
    id,
    position,
    setPosition,
    positionHint,
    sizeRef,
    visible,
  })

  const { setNodeRef, listeners, transform, attributes, setActivatorNodeRef, active } = useDraggable({
    id: 'dialog',
    data: { sizeRef },
  })

  const maxHeight = useMemo(() => {
    const { height } = (portal ?? document.body).getBoundingClientRect()
    return height
  }, [portal])

  const positionStyle = useMemo<CSSProperties>(
    () => ({
      ...(
        position
          ? {
            left: `${position.left}px`,
            top: `${position.top}px`,
          }
          : positionHint
      ),
      transform: CSS.Translate.toString(transform),
      position: 'fixed',
      zIndex,
    }),
    [position, positionHint, transform, zIndex],
  )

  const sizeStyle: CSSProperties = useMemo(() => ({
    ...(size ?
      {
        width: `${size.width}px`,
        height: `${size.height}px`,
      } : sizeHint),
    maxHeight: maxHeight - 16,
    ...minmaxSize,
  }), [maxHeight, minmaxSize, size, sizeHint])

  const onExited = useCallback(() => {
    if (!rememberPosition) {
      setPosition(undefined)
    }
  }, [rememberPosition, setPosition])

  const transitionRef = useRef<HTMLDivElement>(null)

  return (
    <CSSTransition
      timeout={fadeDuration}
      classNames={fadeClassNames}
      mountOnEnter
      onExited={onExited}
      in={visible}
      nodeRef={transitionRef}
      appear
    >{state => (
      <div
        ref={sizeRef}
        style={{
          ...positionStyle,
          display: (state === 'exited' && !visible) ? 'none' : 'block',
        }}
      >
        <Resizable
          enabled={resizable}
          container={sizeRef}
          position={position}
          setPosition={setPosition}
          size={size}
          setSize={setSize}
        >
          <div ref={transitionRef} className={styles.transitionWrapper}>
            <div
              className={classNames(styles.dialog, $classNames.dialog, active && $classNames.active)}
              ref={setNodeRef}
              style={sizeStyle}
              onMouseDown={() => raiseDialog(id)}
            >
              <div
                className={classNames(styles.titlebar, $classNames.titlebar)}
                ref={setActivatorNodeRef}
                {...listeners}
                {...attributes}
              >
                {title}
              </div>
              <div className={classNames(styles.content, $classNames.content)} >
                {children}
              </div>
            </div >
          </div>
        </Resizable>
      </div >
    )}
    </CSSTransition>
  )
}



type PositionRegistryProps = {
  id: number
  sizeRef: RefObject<HTMLDivElement>
  visible: boolean
  position: Position | undefined
  setPosition: React.Dispatch<React.SetStateAction<Position | undefined>>
  positionHint: CSSPosition | undefined
}

function usePositionRegistry({
  id,
  position,
  setPosition,
  positionHint,
  sizeRef,
  visible,
}: PositionRegistryProps) {
  const { dialogs, nextPosition } = useDialogContext()

  useLayoutEffect(() => {
    const el = sizeRef.current
    if (el && visible) {
      // 初回commit時などpositionが未指定の状態ではpositionHintによって場所が決まっている。
      const { width, height, left, top } = sizeRef.current!.getBoundingClientRect()
      if (!position) {
        const newPosition = nextPosition({ width, height }, { positionHint: positionHint && { left, top } })
        dialogs.set(id, { rect: { ...newPosition, width, height } })
        if (!(newPosition.left === left && newPosition.top === top)) {
          setPosition(newPosition)
        }
      }
      else {
        dialogs.set(id, { rect: { left, top, width, height } })
      }
      return () => {
        dialogs.delete(id)
      }
    }
    else {
      dialogs.delete(id)
    }
  }, [dialogs, id, nextPosition, position, positionHint, setPosition, sizeRef, visible])

  useEffect(() => {
    const el = sizeRef.current
    if (el && visible) {
      const resizeObserver = new ResizeObserver(() => {
        const { width, height, left, top } = el.getBoundingClientRect()
        dialogs.set(id, { rect: { left, top, width, height } })
      })
      resizeObserver.observe(el)
      return () => {
        resizeObserver.unobserve(el)
      }
    } else {
      dialogs.delete(id)
    }
  }, [dialogs, id, sizeRef, visible])
}



function useZIndex(id: number) {
  const { zIndex } = useDialogContext()
  if (!zIndex.has(id)) {
    zIndex.set(id, zIndex.size)
  }
  useEffect(() => {
    return () => {
      zIndex.delete(id)
    }
  }, [id, zIndex])
  return zIndex.get(id)!
}
