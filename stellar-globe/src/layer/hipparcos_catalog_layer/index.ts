import { config } from "~/config"
import { Globe } from "~/globe"
import { Layer } from '~/layer/layer'
import { overlayAlpha } from '~/layer/overlayAlpha'
import { PointRenderer } from "~/renderer/point_renderer"
import { on } from "~/utils/event"
import { setWorkerErrorHandler } from "~/utils/setWorkerErrorHandler"
import { View } from "~/view"
import { RequestMessage, ResponseMessage } from './catalog-loader'
import CatalogWorker from './catalog-loader?worker&inline'


type Options = {
  fadeInDuration?: number
}


export class HipparcosCatalogLayer extends Layer {
  private pointRenderer?: PointRenderer
  private array?: Float32Array
  private fadeInAlpha = 1

  constructor(
    globe: Globe,
    {
      fadeInDuration = 0,
    }: Options = {}
  ) {
    super(globe)
    this.addAnimation(({ r }) => {
      this.fadeInAlpha = r
    }, { duration: fadeInDuration })
    this.onRelease(loadCatalog(buffer => {
      this.array = new Float32Array(buffer)
      this.refresh()
    }))
    this.pointRenderer = new PointRenderer(this.globe.gl)
    this.refresh()
    this.onRelease(() => {
      this.pointRenderer!.release()
    })
  }

  render(view: View) {
    const alpha = this.fadeInAlpha * overlayAlpha(view)
    this.pointRenderer!.render(view, alpha)
  }

  private refresh() {
    if (this.globe && this.pointRenderer && this.array) {
      this.pointRenderer._setArray(this.array)
      this.globe.requestRefresh()
    }
  }
}


function loadCatalog(cb: (buffer: ArrayBuffer) => void) {
  const loader = setWorkerErrorHandler(new CatalogWorker())

  const cleanup = Object.assign(() => {
    cleanup.fired = true
    offLoaderMessage()
    loader.terminate()
  }, { fired: false })

  // @ts-ignore
  const offLoaderMessage = on(loader, 'message',
    (e: MessageEvent) => {
      const res: ResponseMessage = e.data
      if (!cleanup.fired) {
        cb(res.buffer)
      }
      if (res.end) {
        cleanup()
      }
    }
  )

  const request: RequestMessage = {
    dataRepository: config.dataRepository,
  }

  loader.postMessage(request)

  return cleanup
}
