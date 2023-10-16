import React from 'react'
import ReactDOM from 'react-dom/client'
import { TestApp } from './TestApp'
import './style.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>,
)
