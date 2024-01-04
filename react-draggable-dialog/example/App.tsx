import { useCallback, useEffect, useMemo, useState } from 'react'
import { DarkDialog } from '../src/DarkDialog'
import { DialogContext } from '../src/Context'
import './style.scss'


export function App() {
  return (
    <DialogContext>
      {Array.from({ length: 20 }).map((_, i) => (
        <MyDialog key={i} />
      ))}
    </DialogContext>
  )
}


function MyDialog() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!visible) {
      setTimeout(() => {
        setVisible(true)
      }, 1000)
    }
  }, [visible])

  const onClick = useCallback(() => {
    setVisible(false)
  }, [])

  const text = useMemo(() => generateRandomSentence(1, 8, 20), [])
  const sizeHint = useMemo(() => ({ width: 100 + Math.floor(200 * Math.random()) }), [])

  return (
    <DarkDialog
      title={'hello'}
      visible={visible}
      sizeHint={sizeHint}
      onCloseButtonClick={onClick}
    >
      {text}
    </DarkDialog >
  )
}


function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function generateRandomSentence(minWordLength: number, maxWordLength: number, numberOfWords: number): string {
  const sentence: string[] = []
  for (let i = 0; i < numberOfWords; i++) {
    const wordLength = Math.floor(Math.random() * (maxWordLength - minWordLength + 1)) + minWordLength
    sentence.push(generateRandomString(wordLength))
  }
  return sentence.join(' ')
}
