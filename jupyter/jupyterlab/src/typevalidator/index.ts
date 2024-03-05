// @ts-ignore
import * as validators from './ajv'


export function createIs<Type>(validatorName: keyof typeof validators) {
  function is(
    obj: any,
  ): obj is Type {
    const v = validators[validatorName]
    if (!v) {
      // @ts-ignore
      throw new Error(`Validator not found: ${validatorName}`)
    }
    const ok = v(obj)
    if (!ok) {
      Object.assign(is, { errors: (v as any).errors as string[] })
    }
    return ok
  }
  return Object.assign(is, { errors: [] as string[] })
}
