import { DataType, HduDecodeOption } from "./types"
import { decode } from "./decoder"
import { Hdu } from "./hdu"


export class Fits extends Array<Hdu> {
  static DataType = DataType

  static async decode(arraybuffer: ArrayBuffer, hduDecodeOptions?: Partial<HduDecodeOption>[]) {
    return await decode(arraybuffer, hduDecodeOptions)
  }

  static async fetch(url: string, hduDecodeOptions?: Partial<HduDecodeOption>[]) {
    const ab = await (await fetch(url, { credentials: 'same-origin' })).arrayBuffer()
    return await this.decode(ab, hduDecodeOptions)
  }
}