import { config } from '~/config'
import { ImageLike } from '~/lib/gl-wrapper'
import { on } from '~/utils/event'
// import { setWorkerErrorHandler } from '../setWorkerErrorHandler'
// import type { DecodeRequest, DecodeResponse } from './background_image_decoder'
// import DecodeWorker from './background_image_decoder?worker&inline'


type LoadImageOptions = {
  failover?: ImageLike
  flipY?: boolean
}


export async function loadImage(
  url: string,
  {
    failover,
    flipY = true,
  }: LoadImageOptions = {},
): Promise<ImageLike> {
  if (config.decodeImageInBackgroundThread) {
    throw new Error(`Invalid config: config.decodeImageInBackgroundThread === true`)
  }
  return loadImageNative(url, { failover, flipY })
  // if (config.decodeImageInBackgroundThread) {
  //   try {
  //     return await backgrouneDecoder.load(url)
  //   } catch (e) {
  //     console.warn(e)
  //     return await loadImageNative(url, { failover, flipY })
  //   }
  // } else {
  //   return loadImageNative(url, { failover, flipY })
  // }
}


async function loadImageNative(url: string, { failover, flipY }: { failover?: ImageLike, flipY: boolean }): Promise<ImageLike> {
  const img = new Image()
  img.crossOrigin = ''
  img.src = url
  try {
    await safeDecodeImageElement(img)
  }
  catch (e) {
    if (failover) {
      return failover
    }
    throw e
  }
  // createImageBitmap still blocks main thread
  // https://bugs.chromium.org/p/chromium/issues/detail?id=580202
  return await createImageBitmap(img, { imageOrientation: flipY ? 'flipY' : undefined })
}


function safeDecodeImageElement(img: HTMLImageElement) {
  if (img.decode) {
    return img.decode()
  } else {
    return new Promise((resolve, reject) => {
      const offLoad = on(img, 'load', () => {
        offLoad()
        offError()
        resolve(img)
      })
      const offError = on(img, 'error', (e) => {
        offLoad()
        offError()
        reject(e.error)
      })
    })
  }
}


// type PromiseSet<T, U> = {
//   promise: Promise<T>
//   resolve: (value: T) => void
//   reject: (error: U) => void
// }


// class BackgroundImageDecoder {
//   private queueMap = new Map<string, PromiseSet<ImageBitmap, unknown>[]>()

//   constructor() {
//     this.setupWorker()
//   }

//   load(url: string, { flipY = true }: { flipY?: boolean } = {}) {
//     if (!this.queueMap.has(url)) {
//       this.queueMap.set(url, [])
//     }
//     const ps = promiseSet<ImageBitmap, unknown>()
//     this.queueMap.get(url)!.push(ps)
//     const msg: DecodeRequest = { url, flipY }

//     this.worker.postMessage(msg)
//     return ps.promise
//   }

//   private worker!: Worker
//   private workerReady!: Promise<boolean>

//   private async setupWorker() {
//     this.workerReady = new Promise(async resolve => {
//       this.worker = setWorkerErrorHandler(new DecodeWorker())
//       resolve(true)
//     })
//     await this.workerReady
//     this.worker!.addEventListener('message', e => {
//       const msg: DecodeResponse = e.data
//       const l = this.queueMap.get(msg.url)!
//       const { reject, resolve } = l.shift()!
//       if (l.length === 0) {
//         this.queueMap.delete(msg.url)
//       }
//       if (msg.type === 'error') {
//         // console.log('error', msg.message)
//         reject(msg.message)
//       }
//       if (msg.type === 'ok') {
//         // console.log(msg.imageBitmap)
//         resolve(msg.imageBitmap)
//       }
//     })
//   }
// }


// const backgrouneDecoder = new BackgroundImageDecoder()


// function promiseSet<T, U>() {
//   let resolve: (value: T) => void
//   let reject: (value: U) => void
//   const promise = new Promise<T>((_resolve, _reject) => {
//     resolve = _resolve
//     reject = _reject
//   })
//   return {
//     promise,
//     // @ts-ignore
//     resolve,
//     // @ts-ignore
//     reject,
//   }
// }
