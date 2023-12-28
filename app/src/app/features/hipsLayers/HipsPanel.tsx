import { SkyCoord, angle } from '@stellar-globe/stellar-globe'
import { Fragment, Suspense, memo, useCallback, useMemo } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Linkify } from '../../../common/components/Linkify'
import { setDisplayName } from "../../../common/utils/setDisplayName"
import { useAppContext } from '../../context'
import { useAppSelector } from "../../store/hooks"
import styles from './style.module.scss'


export const HipsPanel = memo(() => {
  const currentBaseUrl = useAppSelector(state => state.hipsLayers.baseUrl)

  return (
    <Fragment>
      {currentBaseUrl && (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback="Loading...">
            <HipsInspector baseUrl={currentBaseUrl} />
          </Suspense>
        </ErrorBoundary>
      )}
    </Fragment >
  )
})


type HipsInspectorProps = {
  baseUrl: string
}

const HipsInspector = memo(({ baseUrl }: HipsInspectorProps) => {
  const properties = useHipsProperties(baseUrl)

  const initialPosition = useMemo(() => {
    const safeNumber = (s: string | undefined) => {
      const n = Number(s)
      return Number.isFinite(n) ? n : undefined
    }
    const fov = safeNumber(properties.cards.find(c => c.key === 'hips_initial_fov')?.value)
    const ra = safeNumber(properties.cards.find(c => c.key === 'hips_initial_ra')?.value)
    const dec = safeNumber(properties.cards.find(c => c.key === 'hips_initial_dec')?.value)
    if (ra !== undefined && dec !== undefined) {
      return { ra, dec, fov }
    }
  }, [properties])

  const { globeHandle } = useAppContext()

  const goToInitialPosition = useCallback(() => {
    if (initialPosition) {
      const { ra, dec, fov } = initialPosition
      globeHandle.current!().camera.jumpTo({ fovy: fov ? angle.deg2rad(fov) : angle.amin2rad(1) }, { coord: SkyCoord.fromDeg(ra, dec) })
    }
  }, [globeHandle, initialPosition])

  const title = useMemo(() => properties.cards.find(c => c.key === 'obs_title')?.value, [properties])

  return (
    <table className={styles.hipsInspector}>
      <caption>{title}</caption>
      <tbody>
        {properties.cards.map((card, index) => (
          <tr key={index}>
            <th>{
              initialPosition && card.key.match(/hips_initial_(?:ra|dec|fov)$/)
                ? <a href="./" onClick={e => { e.preventDefault(); goToInitialPosition() }}>{card.key}</a>
                : card.key
            }</th>
            <td>
              <Linkify text={card.value} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
})

setDisplayName({ HipsInspector })

type Card = {
  key: string
  value: string
}

type HipsProperties = {
  cards: Card[]
}


const cache = new Map<string, { promise: Promise<void>, result?: HipsProperties, error?: any }>()


function useHipsProperties(baseUrl: string) {
  if (!cache.has(baseUrl)) {
    const promise = (async () => {
      try {
        const result = parseHipsProperties(await (await fetch(`${baseUrl}/properties`)).text())
        cache.get(baseUrl)!.result = result
      }
      catch (error) {
        cache.get(baseUrl)!.error = error
      }
    })()
    cache.set(baseUrl, { promise })
  }
  const { promise, result, error } = cache.get(baseUrl)!
  if (result) {
    return result
  }
  throw error ?? promise
}


function parseHipsProperties(input: string): HipsProperties {
  const lines = input.split('\n')
  const cards: Card[] = []

  lines.forEach(line => {
    // コメント行を無視
    if (!line.startsWith('#') && line.trim() !== '') {
      const [key, value] = line.split('=', 2).map(part => part.trim())
      if (key && value) {
        cards.push({ key, value })
      }
    }
  })

  return {
    cards,
  }
}
