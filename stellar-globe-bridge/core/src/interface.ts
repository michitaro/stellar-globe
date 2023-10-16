import {
  ClickableMarkerLayer$,
  ConstellationLayer$,
  EsoMilkyWayLayer$,
  GridLayer$,
  HipparcosCatalogLayer$,
  HipsSimpleLayer$,
  SspTileLayer$,
  TextLayer$,
} from '@stellar-globe/react-stellar-globe'

export const LayerComponents = {
  ConstellationLayer: ConstellationLayer$,
  EsoMilkyWayLayer: EsoMilkyWayLayer$,
  SspTileLayer: SspTileLayer$,
  GridLayer: GridLayer$,
  TextLayer: TextLayer$,
  HipparcosCatalogLayer: HipparcosCatalogLayer$,
  HipsSimpleLayer: HipsSimpleLayer$,
  ClickableMarkerLayer: ClickableMarkerLayer$,
}

export type LayerNames = keyof typeof LayerComponents
type Props<T extends (...args: never[]) => unknown> = Parameters<T>[0]


type NativeLayerProps = {
  [K in LayerNames]: Props<(typeof LayerComponents)[K]>
}

export type LayerProps = {
  [K in keyof NativeLayerProps]: {
    [P in keyof NativeLayerProps[K]]: ConvertFunctionToCallback<NativeLayerProps[K][P]>
  }
}

export const CALLBACK_KEY = 'stellarglobe_bridge_callback'

export type CallbackDef = {
  [CALLBACK_KEY]: {
    id: number
  }
}

type ConvertFunctionToCallback<T> = T extends undefined ? undefined : (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any[]) => unknown ?
  CallbackDef : T
)

export type { WrapperToCoreMessage } from './Core/messageHandlers'
export type { CoreToWrapperMessage } from './Core'
export { Connection } from './Connection'
