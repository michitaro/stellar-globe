import styles from './style.module.scss'
import { Fragment, Suspense, memo } from "react"
import { useAppSelector } from "../../store/hooks"
import { setDisplayName } from "../../../common/utils/setDisplayName"
import { ErrorBoundary } from "react-error-boundary"
import { Menu } from '@szhsin/react-menu'
import { HipsMenu } from './hipsMenu'
import { useAppContext } from '../../context'
import { Linkify } from '../../../common/components/Linkify'

export const HipsPanel = memo(() => {
  const currentBaseUrl = useAppSelector(state => state.hipsLayers.baseUrl)
  const { rootElementRef } = useAppContext()

  return (
    <Fragment>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Menu
          theming='dark'
          menuButton={<button>Set Source</button>}
          portal={{ target: rootElementRef.current }}
          submenuOpenDelay={0}
          submenuCloseDelay={0}
          transition={{ close: true }}
        >
          <HipsMenu />
        </Menu>
      </div>
      <hr />
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

  return (
    <table className={styles.hipsInspector}>
      <tbody>
        {properties.cards.map((card, index) => (
          <tr key={index}>
            <th>{card.key}</th>
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
