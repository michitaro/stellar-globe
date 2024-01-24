import { FC } from 'react'
import type { AppHandle, AppProps } from '../src/app/types'

declare const App: FC<AppProps & { ref: unknown }>
export default App

export type { AppHandle }

