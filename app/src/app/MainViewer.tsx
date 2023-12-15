import { BeautifulObjectLayer$, ConstellationLayer$, EsoMilkyWayLayer$, Globe$, GlobeEventLayer$, GridLayer$, HipparcosCatalogLayer$, TouchLayer$, TractTileLayer$, ZoomLayer$ } from "@stellar-globe/react-stellar-globe"
import { Globe } from "@stellar-globe/stellar-globe"
import { debounce } from "../utils/debounce"
import { useAppContext } from "./context"
import { CameraParams, cameraSlice } from "./features/camera/cameraSlice"
import { RegionsLayer } from "./features/regions/RegionsLayer"
import { ToolsLayer } from "./features/regions/ToolsLayer"
import { useAppDispatch, useAppSelector } from "./store/hooks"


export function MainViewer() {
  const { globeHandle } = useAppContext()
  const layers = useAppSelector(state => state.layers)
  const camera = useAppSelector(state => state.camera)
  const dispatch = useAppDispatch()

  const onCameraMove = debounce(200, () => {
    dispatch(cameraSlice.actions.paramsChanged(cameraParamsFromGlobe(globeHandle.current!())))
  })

  const params = useAppSelector(state => state.tractTileLayers.colorParams)
  const tractTilelayers = useAppSelector(state => state.tractTileLayers.layers)

  return (
    // <MainContextMenu>
    <Globe$
      ref={globeHandle}
      projection={camera.projection}
      retina={camera.retina}
      cameraParams={camera.params}
      noDefaultLayers
    >
      <GlobeEventLayer$ onCameraMove={onCameraMove} />
      <ZoomLayer$ />
      <TouchLayer$ />

      {
        tractTilelayers.map(({ baseUrl, visible, filterNameDictionary }) => (
          <TractTileLayer$
            key={baseUrl} baseUrl={baseUrl} outline colorParams={params} visible={visible}
            filterNameDictionary={filterNameDictionary}
          />
        ))
      }

      {/* Appearance Layers */}
      <BeautifulObjectLayer$ {...layers.nearbyGalaxiesAndNebulas} />
      <EsoMilkyWayLayer$ {...layers.esoMilkyWay} />
      <HipparcosCatalogLayer$ {...layers.hipparcosCatalog} />
      <ConstellationLayer$ {...layers.constellation} />
      <GridLayer$ {...layers.grid} />

      <ToolsLayer />
      <RegionsLayer />
    </Globe$>
    // </MainContextMenu>
  )
}


function cameraParamsFromGlobe(globe: Globe) {
  const camera = globe.camera
  const { theta, phi, roll, za, zd, zp, fovy } = camera
  const { a, d } = camera.center()
  const params: CameraParams = { theta, phi, roll, za, zd, zp, fovy, skyCoord: { ra: a.rad, dec: d.rad } }
  return params
}
