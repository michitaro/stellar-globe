import { BeautifulObjectLayer$, ConstellationLayer$, EsoMilkyWayLayer$, Globe$, GlobeEventLayer$, GridLayer$, HipparcosCatalogLayer$, HipsSimpleLayer$, RollLayer$, TouchLayer$, ZoomLayer$ } from "@stellar-globe/react-stellar-globe"
import { Globe } from "@stellar-globe/stellar-globe"
import { debounce } from "../common/utils/debounce"
import { useAppContext } from "./context"
import { CameraParams, cameraSlice } from "./features/camera/cameraSlice"
import { CatalogLayers } from "./features/catalog/CatalogLayers"
import { RegionsLayer } from "./features/regions/RegionsLayer"
import { ToolsLayer } from "./features/regions/ToolsLayer"
import { TractTileLayers } from "./features/tractTileLayers/TractTileLayers"
import { useAppDispatch, useAppSelector } from "./store/hooks"
import { TractFrameLayer$ } from "./features/appearanceLayers/RingsTract/TractFrameLayer"
import { TractNumbersLayer } from "./features/appearanceLayers/RingsTract/TractNumbersLayer"


export function MainViewer() {
  const dispatch = useAppDispatch()
  const { globeHandle } = useAppContext()

  const layers = useAppSelector(state => state.appearanceLayers)
  const camera = useAppSelector(state => state.camera)

  const onCameraMove = debounce(200, () => {
    dispatch(cameraSlice.actions.paramsChanged(cameraParamsFromGlobe(globeHandle.current!())))
  })

  const hips = useAppSelector(state => state.hipsLayers)

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
      <RollLayer$ />
      <TouchLayer$ />

      <BeautifulObjectLayer$ {...layers.nearbyGalaxiesAndNebulas} />

      {hips.baseUrl && <HipsSimpleLayer$ baseUrl={hips.baseUrl} />}
      <TractTileLayers />

      <EsoMilkyWayLayer$ {...layers.esoMilkyWay} />

      <HipparcosCatalogLayer$ {...layers.hipparcosCatalog} />
      <ConstellationLayer$ {...layers.constellation} />
      <GridLayer$ {...layers.grid} />

      <TractFrameLayer$ showPatch={layers.tracts.patch} visible={layers.tracts.visible} />
      {layers.tracts.visible &&
        <TractNumbersLayer />
      }

      <CatalogLayers />

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
