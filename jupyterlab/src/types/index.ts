import { DockLayout } from '@lumino/widgets'

export type OpenWindowMessage = {
  id: string
  title?: string
  layout?: NonNullable<Parameters<DockLayout['addWidget']>[1]>['mode']
}

export type MessagesToStellarGlobe = {
  OpenWindowMessage: OpenWindowMessage,
}
