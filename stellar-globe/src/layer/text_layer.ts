import { Globe } from '~/globe'
import { BillboardImage, BillboardImageRef, BillboardRenderer } from '~/renderer/billboard_renderer'
import { V3 } from "~/types"
import { text2imageData } from '~/utils/text2imagedata'
import { View } from '~/view'
import { Layer } from './layer'
import { overlayAlpha } from "./overlayAlpha"


export type BillboardText = {
  text: string,
  position: V3,
  font?: string,
  color?: string,
}


type Options = {
  texts: BillboardText[]
  defaultFont?: string
  defaultColor?: string
  alphaFunc?: (view: View) => number
}


export class TextLayer extends Layer {
  private renderer: BillboardRenderer
  defaultFont: string
  defaultColor: string
  alphaFunc: (view: View) => number

  constructor(
    globe: Globe,
    {
      texts,
      defaultColor = 'white',
      defaultFont = 'sans-serif',
      alphaFunc,
    }: Options,
  ) {
    super(globe)
    this.defaultFont = defaultFont
    this.defaultColor = defaultColor
    this.alphaFunc = alphaFunc ?? overlayAlpha
    this.renderer = new BillboardRenderer(this.globe.gl)
    this.buildTextBillboards(texts)
    this.globe.requestRefresh()
    this.onRelease(() => {
      this.renderer.release()
    })
  }

  update({ defaultColor, defaultFont, texts }: {
    texts?: BillboardText[],
    defaultFont?: string,
    defaultColor?: string,
  } = {}) {
    this.defaultFont = defaultFont ?? this.defaultFont
    this.defaultColor = defaultColor ?? this.defaultColor
    texts && this.buildTextBillboards(texts)
    this.globe.requestRefresh()
  }

  private buildTextBillboards(texts: BillboardText[]) {
    const images: BillboardImage[] = []
    const imageRefs: BillboardImageRef[] = []
    for (const bt of texts) {
      imageRefs.push({
        imageID: images.length,
        position: bt.position,
        color: [1, 1, 1, 1],
      })
      images.push({
        imageData: text2imageData(bt.text, bt.font || this.defaultFont, bt.color || this.defaultColor),
        origin: [0, 0],
      })
    }
    this.renderer.buildArray(images, imageRefs)
  }

  render(view: View, alpha = 1) {
    this.renderer.render(view, alpha * this.alphaFunc(view))
  }
}
