import { useCallback, useEffect, useMemo, useState } from 'react'
import { DialogContext } from '../src/Context'
import { DarkDialog } from '../src/DarkDialog'
import { CSSSize } from '../src/types'
import './style.scss'


export function Example() {
  const [count, setCount] = useState(10)

  return (
    <DialogContext>
      <RightBottom />
      <button onClick={() => setCount(_ => _ + 1)}>+</button>
      <button onClick={() => setCount(_ => 0)}>Clear</button>
      {Array.from({ length: count }).map((_, i) => (
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
      }, 2000)
    }
  }, [visible])

  const onClick = useCallback(() => {
    setVisible(false)
  }, [])

  const text = useMemo(() => generateRandomSentence(1, 8, 20), [])
  const sizeHint = useMemo<CSSSize>(() => ({
    width: 100 + Math.floor(200 * Math.random()),
  }), [])

  return (
    <DarkDialog
      title={'hello'}
      visible={visible}
      sizeHint={sizeHint}
      onCloseButtonClick={onClick}
      positionHint={{ left: 8, bottom: 8 }}
      resizable
      minmaxSize={{
        minWidth: '80px',
        minHeight: '80px',
        maxWidth: '300px',
        maxHeight: '50vh',
      }}
    >
      {text}
    </DarkDialog >
  )
}


function RightBottom() {
  const [text, setText] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setText(generateRandomSentence(1, 8, 10))
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <DarkDialog
      title="RightBottom"
      positionHint={{ right: '10px', bottom: '10px' }}
      sizeHint={{ width: '200px' }}
    >
      {text}
    </DarkDialog>
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
