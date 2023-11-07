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
            const worker = this.setupWorker()
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

    private setupWorker() {
        if (this.worker === undefined) {
            this.worker = setWorkerErrorHandler(new DecodeWorker())
            this.worker.addEventListener('message', e => {
                const response: WorkerResponseMessage = e.data
                const { resolve, reject } = this.callbacks.get(response.requestId)!
                this.callbacks.delete(response.requestId)
                if (response.error) {
                    reject(response.error)
                }
                else {
                    resolve(response.hduSources!.map(Hdu.fromSource))
                }
            })
        }
        return this.worker
    }

    private static _singleton?: Decoder
    static singleton() {
        this._singleton ??= new Decoder()
        return this._singleton
    }
}


export async function decode(fileContent: ArrayBuffer, hduDecodeOptions?: Partial<HduDecodeOption>[]) {
    const hdul = await Decoder.singleton().decode(fileContent, hduDecodeOptions)
    return hdul
}
