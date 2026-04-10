import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from './index'
import { makeStore } from './store'


vi.mock('./features/dialogs/Dialogs', async () => {
  const React = await import('react')
  const { useBlockUI } = await import('../common/components/Modal')

  return {
    Dialogs: () => {
      useBlockUI()
      return React.createElement('div', { 'data-testid': 'dialogs' })
    },
  }
})

vi.mock('./MainViewer', () => ({
  MainViewer: () => null,
}))

vi.mock('./MainMenu', () => ({
  default: () => null,
}))

vi.mock('./AppDragAndDrop', async () => {
  const React = await import('react')
  return {
    AppDragAndDrop: ({ children }: { children?: ReactNode }) => React.createElement(React.Fragment, null, children),
  }
})

vi.mock('./features/indicator/Indicator', () => ({
  Indicator: () => null,
}))

vi.mock('./keybindings/appKeybindings', async () => {
  const React = await import('react')
  return {
    KeybindsProvider: ({ children }: { children?: ReactNode }) => React.createElement(React.Fragment, null, children),
  }
})

vi.mock('../common/hooks/useFullscreen', () => ({
  useIsFullscreen: () => ({ isFullscreen: false }),
}))


describe('App', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders dialogs within ModalProvider', () => {
    const { store } = makeStore({ storageKey: '@test/app', hashSync: false })
    const initialState = {
      ...store.getState(),
      cas: {
        ...store.getState().cas,
        enabled: true,
      },
    }

    render(<App initialState={initialState} />)

    expect(screen.getByTestId('dialogs')).toBeTruthy()
  })
})
