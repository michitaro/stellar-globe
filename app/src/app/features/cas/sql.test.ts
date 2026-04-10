import { test } from 'vitest'
import { expandCasSql } from './sql'
import { RectangularRegion } from '../regions/regionsSlice'

test('expands the selection box placeholder', () => {
  const region: RectangularRegion = {
    id: 'region-1',
    type: 'Rectangular',
    name: '',
    color: [0, 0, 0, 0],
    visible: true,
    showLabel: true,
    minRa: 1,
    maxRa: 2,
    minDec: -0.5,
    maxDec: 0.5,
  }

  const sql = expandCasSql({
    sql: 'SELECT * FROM pdr3_wide.forced WHERE $coord_in_selection_box',
    region,
  })

  expect(sql).toContain('pdr3_wide.forced')
  expect(sql).toContain('boxSearch(coord, 57.29577951308232, 114.59155902616465, -28.64788975654116, 28.64788975654116)')
})

test('expands selection placeholder to true when no region is selected', () => {
  const sql = expandCasSql({
    sql: 'SELECT * FROM pdr3_wide.forced WHERE $coord_in_selection_box',
  })

  expect(sql).toBe(`SELECT * FROM pdr3_wide.forced WHERE 't'`)
})
