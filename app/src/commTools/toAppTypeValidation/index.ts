import { ToApp, validateToAppMessage as validateToAppMessageType } from "../../../types/commTools"
import { createIs } from './createIs'


export function validateToAppMessage(type: keyof ToApp, message: any): { errors: string[] } {
  const is = safe(() => createIs(type))
  if (is === undefined) {
    return { errors: [`Validator not found: ${type}`] }
  }
  is(message)
  const errors = is.errors ?? [] as string[]
  return { errors }
}


function safe<T>(cb: () => T): T | undefined {
  try {
    return cb()
  } catch {
    return
  }
}

type AssertTypeImplements<T, U extends T> = T
type _TypeCheck1 = AssertTypeImplements<typeof validateToAppMessageType, typeof validateToAppMessage>
