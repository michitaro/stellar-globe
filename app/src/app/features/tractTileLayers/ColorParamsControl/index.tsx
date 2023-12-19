import type { TractTileLayer$ } from '@stellar-globe/react-stellar-globe'
import { LogScaleRange } from "@stellar-globe/react-stellar-globe"
import { TractTileLayer, V3 } from "@stellar-globe/stellar-globe"
import { produce } from 'immer'
import { memo, useMemo } from "react"
import { ColorPickerRgb } from '../../../../common/components/ColorPicker'
import NumericInput from '../../../../common/components/NumericInput'
import styles from './styles.module.scss'
import { defaultFilters, filterCandidates } from '../tractTileLayersSlice'


type ColorParams = NonNullable<Parameters<typeof TractTileLayer$>[0]['colorParams']>
type MixerType = ColorParams['type']
type FilterCandidate = {
  short: string
  full: string
}


type Props = {
  params: ColorParams
  onChange: (params: ColorParams) => void
}


const paramsMemo = new Map<MixerType, ColorParams>()



export const ColorParamsControl = memo(({ params, onChange }: Props) => {
  return (
    <div className={styles.colorParamsControl}>
      <div style={{ display: 'flex' }}>
        <select style={{ flexGrow: 1 }} value={params.type} onChange={e => {
          const type = e.currentTarget.value as MixerType
          paramsMemo.set(params.type, params)
          onChange(paramsMemo.get(type) ?? TractTileLayer.defaultParams({ type, filters: defaultFilters }))
        }} >
          <option value='sdssTrueColor'>SDSS True Color</option>
          <option value='sdssTrueColorMatrix'>SDSS True Color Matrix</option>
          <option value='simpleRgb'>Simple RGB</option>
          <option value='simpleColorMatrix'>Simple Color Matrix</option>
        </select>
        <button onClick={() => {
          onChange(TractTileLayer.defaultParams({ type: params.type, filters: defaultFilters }))
        }}>Reset</button>
      </div>
      {
        params.type === 'sdssTrueColorMatrix' ? (
          <MatrixControl
            filterCandidates={filterCandidates}
            colors={params[params.type].colors}
            filters={params.filters}
            onChange={({ filters, colors }) => {
              onChange(produce(params, _ => {
                _.filters = filters
                _.sdssTrueColorMatrix.colors = colors
              }))
            }} />
        ) : (params.type === 'simpleColorMatrix' ? (
          <MatrixControl
            filterCandidates={filterCandidates}
            colors={params[params.type].colors}
            filters={params.filters}
            onChange={({ colors, filters }) => {
              onChange(produce(params, _ => {
                _.simpleColorMatrix.colors = colors
                _.filters = filters
              }))
            }} />
        ) : (
          <FilterSelector filterCandidates={filterCandidates} filters={params.filters} onChange={newFilters => {
            onChange(produce(params, _ => { _.filters = newFilters }))
          }} />
        ))}
      <ScalarParamsControl params={mixerParams(params)} onChange={newParams => onChange(produce(params, _ => {
        Object.assign(mixerParams(_), newParams)
      }))} />
    </div>
  )
})


type MatrixControlProps = {
  filterCandidates: FilterCandidate[]
  filters: ColorParams['filters']
  colors: V3[]
  onChange: (newValue: { colors: V3[], filters: ColorParams['filters'] }) => void
}


function MatrixControl({
  colors,
  filters,
  filterCandidates,
  onChange,
}: MatrixControlProps) {
  // filterCandidates → colors のインデックスの変換
  const indexMap = useMemo(() => {
    return Object.fromEntries(filterCandidates.map((f, i) => [i, filters.indexOf(f.full)]))
  }, [filterCandidates, filters])

  return (
    <table className={styles.matrixControl}>
      <tbody>
        <tr>
          {filterCandidates.map((f, i) => (
            <td key={i}>
              <button onClick={() => {
                onChange({ colors: [[1, 1, 1]], filters: [f.full] })
              }} >
                {f.short}
              </button>
            </td>
          ))}
        </tr>
        <tr>
          {filterCandidates.map((f, i) => (
            <td key={i}>
              <input type="checkbox" checked={filters.includes(f.full)} onChange={e => {
                const newValue = produce({ colors, filters }, _ => {
                  if (e.currentTarget.checked) {
                    _.filters.push(f.full)
                    _.colors.push([0, 0, 0])
                  }
                  else {
                    if (filters.length > 1) {
                      const i = _.filters.indexOf(f.full)
                      if (i >= 0) {
                        _.filters.splice(i, 1)
                        _.colors.splice(i, 1)
                      }
                    }
                  }
                })
                onChange(newValue)
              }} />
            </td>
          ))}
        </tr>
        <tr>
          {filterCandidates.map((f, i) => (
            <td key={i}>
              {indexMap[i] >= 0 && (
                <ColorPickerRgb color={colors[indexMap[i]]} onChange={newColor => {
                  onChange(produce({ colors, filters }, _ => {
                    _.colors[indexMap[i]] = newColor
                  }))
                }} />
              )}
            </td>
          ))}
        </tr>
        <tr className={styles.colorText}>
          {filterCandidates.map((f, i) => (
            <td key={i}>
              <div>
                {indexMap[i] >= 0 && [0, 1, 2].map(j => (
                  <NumericInput key={j} type="text" value={colors[indexMap[i]][j]} onChange={newValue => {
                    onChange(produce({ colors, filters }, _ => {
                      _.colors[indexMap[i]][j] = Number(newValue)
                    }))
                  }} />
                ))}
              </div>
            </td>
          ))}
        </tr>
      </tbody>
    </table >
  )
}


type FilterSelectorProps = {
  filterCandidates: FilterCandidate[]
  filters: ColorParams['filters']
  onChange: (filters: ColorParams['filters']) => void
}


function FilterSelector({
  filterCandidates,
  filters,
  onChange,
}: FilterSelectorProps) {
  const rgb = [
    { name: 'r', color: '#f33' },
    { name: 'g', color: '#3f3' },
    { name: 'b', color: '#33f' },
  ]

  return (
    <table className={styles.filterSelector}>
      <tbody>
        <tr>
          <th />
          {filterCandidates.map(f => (
            <td key={f.short}><button onClick={() => onChange([f.full, f.full, f.full])} >{f.short}</button></td>
          ))}
        </tr>
        {[0, 1, 2].map(i => (
          <tr key={i}>
            <th style={{ color: rgb[i].color }}>{rgb[i].name}</th>
            {filterCandidates.map(f => (
              <td key={f.short}>
                <input
                  type="radio"
                  checked={f.full === filters[i]}
                  onChange={() => {
                    onChange(produce(filters, _ => {
                      _[i] = f.full
                    }))
                  }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}


type ScalarParamsProps = {
  params: ReturnType<typeof mixerParams>
  onChange: (params: ReturnType<typeof mixerParams>) => void
}


function ScalarParamsControl({ params, onChange }: ScalarParamsProps) {
  return (
    <table className={styles.scalarParamsControl}>
      <tbody>
        <tr>
          <th> &beta; </th>
          <td>
            <LogScaleRange value={params.beta} min={0} max={1.e+7} onInput={beta => {
              onChange(produce(params, _ => { _.beta = beta }))
            }} />
          </td>
        </tr>
        <tr>
          <th> b<sub>0</sub> </th>
          <td>
            <LogScaleRange value={params.b0} min={0} max={5.e-5} onInput={b0 => {
              onChange(produce(params, _ => { _.b0 = b0 }))
            }} />
          </td>
        </tr>
        <tr>
          <th> A </th>
          <td>
            <LogScaleRange value={params.a} min={0} max={1.e4} onInput={a => {
              onChange(produce(params, _ => { _.a = a }))
            }} />
          </td>
        </tr>
        <tr>
          <th> bias </th>
          <td>
            <LogScaleRange value={params.bias} min={-0.5} max={0.5} a={1.e-8} onInput={bias => {
              onChange(produce(params, _ => { _.bias = bias }))
            }} />
          </td>
        </tr>
      </tbody>
    </table>
  )
}


function mixerParams(params: ColorParams) {
  switch (params.type) {
    case 'sdssTrueColor':
      return params.sdssTrueColor
    case 'sdssTrueColorMatrix':
      return params.sdssTrueColorMatrix
    case 'simpleRgb':
      return params.simpleRgb
    case 'simpleColorMatrix':
      return params.simpleColorMatrix
  }
}
