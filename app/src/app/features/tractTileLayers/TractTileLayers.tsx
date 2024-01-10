import { TractTileLayer$ } from "@stellar-globe/react-stellar-globe"
import { Fragment, Suspense, memo, useMemo } from "react"
import { useAppSelector } from "../../store/hooks"
import { useFilterMap } from "./filtermap"


export const TractTileLayers = memo(() => {
  const tractTilelayers = useAppSelector(state => state.tractTileLayers.layers)
  const params = useAppSelector(state => state.tractTileLayers.colorParams)

  return (
    <Fragment>
      {
        tractTilelayers.map(({ baseUrl, visible }) => (
          <Suspense key={baseUrl}>
            <TractTileLayerWithFilterNameDictionary
              baseUrl={baseUrl}
              outline
              visible={visible}
              colorParams={params}
            />
          </Suspense>
        ))
      }
    </Fragment>
  )
})


function TractTileLayerWithFilterNameDictionary(props: Parameters<typeof TractTileLayer$>[0]) {
  const { baseUrl } = props
  const filterMap = useFilterMap(baseUrl)
  const filterNameDictionary = useMemo(
    () => Object.fromEntries(filterMap.map(({ intrinsicName, commonName }) => [commonName, intrinsicName])),
    [filterMap],
  )
  return <TractTileLayer$ filterNameDictionary={filterNameDictionary} {...props} />
}
