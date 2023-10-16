import * as fastPng from 'fast-png'
import * as jpegJs from 'jpeg-js'


export type DecodeRequest = {
  url: string
  flipY: boolean
}

export type DecodeResponse = Ok | LoadError


type LoadError = {
  type: 'error'
  url: string
  message: string
}

type Ok = {
  type: 'ok'
  url: string
  imageBitmap: ImageBitmap
}


function main() {
  self.addEventListener('message', async (e) => {
    const { url, flipY } = e.data as DecodeRequest
    try {
      const response = await fetch(url, { mode: 'cors' })
      const contentType = response.headers.get('content-type') || 'noContentType'
      const ab = await response.arrayBuffer()
      const decodeRawdata = {
        'image/png': decodePng,
        'image/jpeg': decodeJpeg,
      }[contentType]
      if (decodeRawdata === undefined) {
        throw new Error(`No available decoder for ${contentType}`)
      }
      const imageData = decodeRawdata(ab)
      const imageBitmap = await createImageBitmap(imageData, { imageOrientation: flipY ? 'flipY' : undefined })
      postMessage<DecodeResponse>({ url, type: 'ok', imageBitmap }, [imageBitmap])
    }
    catch (error) {
      postMessage<DecodeResponse>({ url, type: 'error', message: String(error) })
    }
  })
}


main()


function postMessage<T>(data: T, transferable: any[] = []) {
  (self as any as Worker).postMessage(data, transferable)
}



function decodePng(arrayBuffer: ArrayBuffer): ImageData {
  const png = fastPng.decode(arrayBuffer)
  const { data: inData, width, height, channels, depth } = png
  if (depth !== 8) {
    throw new Error(`Unsupported format: png: depth=${depth}`)
  }
  const imageData = new ImageData(width, height)
  const outData = imageData.data

  switch (channels) {
    case 1: {
      let i = 0
      let o = 0
      for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
          const v = inData[i]
          outData[o + 0] = v
          outData[o + 1] = v
          outData[o + 2] = v
          outData[o + 3] = 255
          i += 1
          o += 4
        }
      }
      break
    }
    case 3: {
      let i = 0
      let o = 0
      for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
          outData[o + 0] = inData[i + 0]
          outData[o + 1] = inData[i + 1]
          outData[o + 2] = inData[i + 2]
          outData[o + 3] = 255
          i += 3
          o += 4
        }
      }
      break
    }
    case 4: {
      outData.set(inData)
      // let i = 0
      // let o = 0
      // for (let y = 0; y < height; ++y) {
      //   for (let x = 0; x < width; ++x) {
      //     outData[o + 0] = inData[i + 0]
      //     outData[o + 1] = inData[i + 1]
      //     outData[o + 2] = inData[i + 2]
      //     outData[o + 3] = inData[i + 3]
      //     i += 4
      //     o += 4
      //   }
      // }
      break
    }
    default:
      throw new Error(`Unsupported format: png: channels=${channels}`)
  }
  return imageData
}


function decodeJpeg(arrayBuffer: ArrayBuffer): ImageData {
  const { data, width, height } = jpegJs.decode(arrayBuffer, { useTArray: true })
  const imageData = new ImageData(width, height)
  imageData.data.set(data)
  return imageData
}