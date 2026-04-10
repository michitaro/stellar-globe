import { test } from 'vitest'
import { casPreviewToCatalog } from './preview'

test('converts CAS preview rows to catalog rows', () => {
  const catalog = casPreviewToCatalog({
    count: 1,
    fields: ['object_id', 'ra', 'dec', 'value'],
    rows: [['1', '180', '0', '42']],
  })

  expect(catalog.fields).toEqual(['object_id', 'ra', 'dec', 'value'])
  expect(catalog.attributes).toEqual([['1', '180', '0', '42']])
  expect(catalog.markers).toHaveLength(1)
  expect(catalog.markers[0]?.position[0]).toBeCloseTo(-1, 6)
})
