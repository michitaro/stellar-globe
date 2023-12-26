import React from 'react'
import { AppHandle, AppProps } from '../src/app/types'

declare const App: React.FC<AppProps & { ref: unknown }>

export default App

export type { AppHandle }
