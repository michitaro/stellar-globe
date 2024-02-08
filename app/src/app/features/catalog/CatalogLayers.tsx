import styles from './styles.module.scss'
import { ClickableMarkerLayer$ } from "@stellar-globe/react-stellar-globe"
import { Fragment, memo, useCallback, useMemo, useRef, useState } from "react"
import { useAppSelector } from "../../store/hooks"
import { Catalog } from "./catalogSlice"
import { CSSTransition } from 'react-transition-group'
import { PointMarker } from '../../../common/stellarglobe/PointMarker'
import { V4 } from '@stellar-globe/stellar-globe'


export const CatalogLayers = memo(() => {
  const catalogs = useAppSelector(state => state.catalogs.catalogs)
  const focus = useAppSelector(state => state.catalogs.focusedPosition)
  const focusColor = useMemo<V4>(() => [1, 1, 1, 1], [])

  return (
    <Fragment>
      {catalogs.map(c => (
        <CatalogLayer$
          key={c.id}
          catalog={c}
        />
      ))}
      {focus &&
        <PointMarker
          color={focusColor}
          markerType='circledHollowPlus'
          position={focus}
          markerSize={48}
          markerWidth={0.1}
        />
      }
    </Fragment>
  )
})


type CatalogProps = {
  catalog: Catalog
}


const CatalogLayer$ = memo(({ catalog }: CatalogProps) => {
  type OnHoverChange = Parameters<typeof ClickableMarkerLayer$>[0]['onHoverChange']

  const [showObjectInspector, setShowObjectInspector] = useState(false)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const onHoverChange = useCallback<NonNullable<OnHoverChange>>(({ index }) => {
    setShowObjectInspector(index !== null)
    if (index !== null) {
      setHoverIndex(index)
    }
  }, [])

  const nodeRef = useRef(null)

  return (
    <Fragment>
      <ClickableMarkerLayer$
        defaultColor={catalog.defaultColor}
        defaultType={catalog.defaultType}
        dimmAlpha={0.75}
        markers={catalog.markers}
        baseColor={catalog.baseColor}
        visible={catalog.visible}
        onHoverChange={onHoverChange}
      />
      {catalog.visible && (
        <CSSTransition
          in={showObjectInspector}
          timeout={{ enter: 0, exit: 200 }}
          nodeRef={nodeRef}
          mountOnEnter
          unmountOnExit
          classNames={{
            exit: styles.fadeExit,
            exitActive: styles.fadeExitActive,
          }}
        >
          {hoverIndex === null ? <Fragment /> : (
            <div ref={nodeRef} className={styles.objectInspector}>
              <table>
                <tbody>
                  {catalog.fields.map((field, fieldIndex) => (
                    <tr key={fieldIndex}>
                      <th>{field}</th>
                      <td>{catalog.attributes[hoverIndex][fieldIndex]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CSSTransition>
      )}
    </Fragment>
  )
})
