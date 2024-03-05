import type { validateAction as validateActionType } from '../../../../types/actionValidator.d.ts'
import { BaseAction } from '../../context'
import { createIs, hasValidator } from './index'


const isBaseAction = createIs<BaseAction>('BaseAction')


export function validateAction(action: any) {
  const errors: string[] = []
  do {
    if (isBaseAction(action)) {
      const type = action.type.replace(/\//g, `$`)
      if (hasValidator(type)) {
        const isValidAction = createIs(type as any)
        if (isValidAction(action)) {
          break
        }
        else {
          errors.push(...isValidAction.errors)
        }
      }
      else {
        errors.push(`No validator for action type ${type}`)
      }
    }
    else {
      errors.push(...isBaseAction.errors)
    }
  } while
    // eslint-disable-next-line no-constant-condition
    (false)
  return { errors }
}


type AssertTypeImplements<T, U extends T> = T
type _TypeCheck1 = AssertTypeImplements<typeof validateActionType, typeof validateAction>
