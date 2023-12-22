import { TractTileLayer$ } from "@stellar-globe/react-stellar-globe"
import { Fragment, memo } from "react"
import { useAppSelector } from "../../store/hooks"


export const TractTileLayers = memo(() => {
  const tractTilelayers = useAppSelector(state => state.tractTileLayers.layers)
  const params = useAppSelector(state => state.tractTileLayers.colorParams)

  return (
    <Fragment>
      {
        tractTilelayers.map(({ baseUrl, visible, filterNameDictionary }) => (
          <TractTileLayer$
            key={baseUrl} baseUrl={baseUrl} outline colorParams={params} visible={visible}
            filterNameDictionary={filterNameDictionary}
          />
        ))
      }
    </Fragment>
  )
})