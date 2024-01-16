import React, { CSSProperties, FocusEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { Icon } from '../Icon'

type Props = {
  value: string
  onChange: (newValue: string) => void
  style?: CSSProperties
}

const EditableSpan: React.FC<Props> = ({ value, onChange, style }) => {
  const [isEditing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleSpanClick = () => {
    setEditing(true)
  }

  const handleFormSubmit = (e: FormEvent | FocusEvent) => {
    e.preventDefault()
    onChange(inputValue)
    setEditing(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  if (isEditing) {
    return (
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleFormSubmit}
        />
      </form>
    )
  }

  return (
    <span onClick={handleSpanClick} style={style}>
      {value.trim().length > 0 && value || <Icon type='edit' />}
    </span>
  )
}

export default EditableSpan

export { EditableSpan }
