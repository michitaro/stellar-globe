import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

const globalWithMonacoEnvironment = globalThis as typeof globalThis & {
  MonacoEnvironment?: {
    getWorker: (moduleId: string, label: string) => Worker
  }
}

if (globalWithMonacoEnvironment.MonacoEnvironment === undefined) {
  globalWithMonacoEnvironment.MonacoEnvironment = {
    getWorker() {
      return new editorWorker()
    },
  }
}

loader.config({ monaco })

export { monaco }
