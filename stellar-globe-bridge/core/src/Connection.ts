import { CoreToWrapperMessage } from "./Core"
import { WrapperToCoreMessage } from "./interface"


export function Connection(w: Window, cb: (msg: CoreToWrapperMessage) => void) {
  const msgQueue: Parameters<typeof postMessage>[] = []
  let port: MessagePort | undefined = undefined

  const postMessage = (
    msg: WrapperToCoreMessage,
    transferable?: Transferable[],
  ) => {
    if (port) {
      w.postMessage(msg, '*', transferable)
    }
    else {
      msgQueue.push([msg, transferable])
    }
  }

  const tryConnect = async () => {
    const maxTry = 10
    let wait = 100
    await sleep(200)
    for (let id = 0; id < maxTry; ++id) {
      console.info(`Trying to connect to ${w.location.href} (${id})...`)
      const { port1, port2 } = new MessageChannel()
      const connectedFromCore = new Promise<void>(resolve => {
        port1.onmessage = e => {
          const res: CoreToWrapperMessage = e.data
          if (res.type === 'connected' && res.connected.id === id) {
            resolve()
          }
        }
      })
      const msg: WrapperToCoreMessage = { type: 'connect', args: { port: port2, id } }
      w.postMessage(msg, '*', [port2])
      try {
        await Promise.race([connectedFromCore, timeout(wait)])
        console.info(`Connected to ${w.location.href} (${id})`)
        while (msgQueue.length > 0) {
          postMessage(...msgQueue.shift()!)
        }
        port = port1
        port.onmessage = (e) => {
          cb(e.data)
        }
        return
      }
      catch {
        wait *= 2
        continue
      }
    }
    throw new Error(`Failed to connect: ${w.location.href}`)
  }
  tryConnect()

  return {
    postMessage,
  }
}


function sleep(duration: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), duration)
  })
}

async function timeout(duration: number) {
  await sleep(duration)
  throw new Error('Timeout')
}
