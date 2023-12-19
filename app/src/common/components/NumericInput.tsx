import React, { useEffect, useState } from 'react'


type NumericInputProps = React.HTMLProps<HTMLInputElement> & {
  value: number
  onChange: (newValue: number) => void
}

function NumericInput(props: NumericInputProps) {
  const { value, onChange, ...inputProps } = props
  const [inputValue, setInputValue] = useState(value.toString())


  useEffect(() => {
    // props.valueが変更された時にinputValueを更新します。
    setInputValue(value.toString())
  }, [value])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleBlur = () => {
    validateAndSubmitInput()
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      validateAndSubmitInput()
    }
  }

  const validateAndSubmitInput = () => {
    const numericValue = Number(inputValue)
    if (!isNaN(numericValue)) {
      onChange(numericValue)
    } else {
      setInputValue(value.toString())
    }
  }

  return (
    <input
      {...inputProps}
      type="text"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyPress}
    />
  )
}

export default NumericInput
