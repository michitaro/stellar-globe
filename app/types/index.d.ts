import { FC } from 'react'
import type { AppHandle, AppProps, AppState } from '../src/app/types'

declare const App: FC<AppProps & { ref: unknown }>
export default App

export type { AppHandle, AppState }
