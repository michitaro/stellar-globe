import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { LogScaleRange } from '../src/LogScaleRange'
import React from 'react'
import '@testing-library/jest-dom/vitest'

describe('LogScaleRange', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render correctly', () => {
    render(
      <LogScaleRange
        min={0}
        max={100}
        value={50}
        onInput={() => {}}
      />
    )
    const slider = screen.getByRole('slider')
    expect(slider).toBeInTheDocument()
  })

  it('should call onInput when changed', () => {
    const handleInput = vi.fn()
    render(
      <LogScaleRange
        min={0}
        max={100}
        value={0}
        onInput={handleInput}
      />
    )
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '5000' } }) // nStep default is 10000, so 5000 is middle
    expect(handleInput).toHaveBeenCalled()
    // 値の検証は計算式に依存するため、ここでは呼ばれたことだけを確認する
    // あるいは、計算式を逆算して期待値を求めることも可能
  })
})
