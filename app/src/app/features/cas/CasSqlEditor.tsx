import Editor, { OnMount } from '@monaco-editor/react'
import './monaco'

type Props = {
  sql: string
  busy: boolean
  onChange: (value: string) => void
  onMount: OnMount
}

export default function CasSqlEditor({
  sql,
  busy,
  onChange,
  onMount,
}: Props) {
  return (
    <Editor
      theme='vs-dark'
      language='sql'
      value={sql}
      onChange={value => onChange(value ?? '')}
      onMount={onMount}
      options={{
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 13,
        tabSize: 4,
        wordWrap: 'on',
        readOnly: busy,
      }}
    />
  )
}
