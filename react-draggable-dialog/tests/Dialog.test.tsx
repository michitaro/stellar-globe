import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import { Dialog } from '../src/Dialog'
import { DialogContext } from '../src/Context'
import React from 'react'
import '@testing-library/jest-dom/vitest'

describe('Dialog', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render title and children', () => {
    render(
      <DialogContext>
        <Dialog
          title="Test Title"
          classNames={{}}
          visible={true}
        >
          <div>Test Content</div>
        </Dialog>
      </DialogContext>
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should not render when visible is false', () => {
    render(
      <DialogContext>
        <Dialog
          title="Test Title"
          classNames={{}}
          visible={false}
        >
          <div>Test Content</div>
        </Dialog>
      </DialogContext>
    )
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  })
})
