import { Hdu } from "./hdu"
import { HduDecodeOption, WorkerRequestMessage, WorkerResponseMessage } from "./types"
import DecodeWorker from './decode_worker?worker&inline'
import { setWorkerErrorHandler } from "~/utils/setWorkerErrorHandler"


type Callback = {
    resolve: (hdul: Hdu[]) => void
    reject: (error: any) => void
}


class Decoder {
    private worker?: Worker
    private requestId = 0
    private callbacks = new Map<number, Callback>()

    decode(fileContent: ArrayBuffer, hduDecodeOptions?: Partial<HduDecodeOption>[]) {
        return new Promise<Hdu[]>(async (resolve, reject) => {
            const worker = await this.setupWorker()
            const requestId = ++this.requestId
            const request: WorkerRequestMessage = {
                requestId,
                fileContent,
                hduDecodeOptions,
            }
            this.callbacks.set(requestId, {
                resolve,
                reject,
            })
            worker.postMessage(request)
        })
    }

    private async setupWorker() {
        if (this.worker)
            return this.worker
        this.worker = setWorkerErrorHandler(new DecodeWorker())
        this.worker.addEventListener('message', e => {
            const response: WorkerResponseMessage = e.data
            const { resolve, reject } = this.callbacks.get(response.requestId)!
            response.error ? reject(response.error) : resolve(response.hduSources!.map(Hdu.fromSource))
            this.callbacks.delete(response.requestId)
        })
        return this.worker
    }

    static singleton?: Decoder
}


export async function decode(fileContent: ArrayBuffer, hduDecodeOptions?: Partial<HduDecodeOption>[]) {
    const decoder = Decoder.singleton = Decoder.singleton || new Decoder()
    const hdul = await decoder.decode(fileContent, hduDecodeOptions)
    return hdul
}