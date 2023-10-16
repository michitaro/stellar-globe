import { GlobePointerEvent } from "~/layer/GlobePointerEvent"

export interface GlobeEventMap {
  'camera-move-start': CameraMoveEvent
  'camera-move-end': CameraMoveEvent
  'camera-move': CameraMoveEvent
  'pointer-down': GlobePointerEvent
  'pointer-move': GlobePointerEvent
  'pointer-up': GlobePointerEvent
  'layer-change': LayerChangeEvent
  'imageloadend': ImageLoadEvent
  'hips-shiftmap-worker-start': {}
  'hips-shiftmap-worker-end': {}
  'resize': GlobeResizeEvent
}

type CameraMoveEvent = {}
type LayerChangeEvent = {}
type ImageLoadEvent = {}
type GlobeResizeEvent = {}
