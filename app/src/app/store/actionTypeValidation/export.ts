import { BaseAction } from '../../context'
import { createIs, hasValidator } from './index'


const isBaseAction = createIs<BaseAction>('BaseAction')


let errors: undefined | string[] = undefined


function isValidActionWithTypeAssertion(action: any): action is BaseAction {
  errors = []
  if (isBaseAction(action)) {
    const type = action.type.replace(/\//g, `$`)
    if (hasValidator(type)) {
      const isValidAction = createIs(type as any)
      if (isValidAction(action)) {
        return true
      }
      else {
        errors = isValidAction.errors
      }
    }
    else {
      errors = [`No validator for action type ${type}`]
    }
  }
  else {
    errors = isValidAction.errors
  }
  return false
}


export const isValidAction = Object.assign(isValidActionWithTypeAssertion, {
  get errors() {
    return errors
  }
})


type AssertTypeImplements<T, U extends T> = T
import type { isValidAction as isValidActionType } from '../../../../types/actionValidator.d.ts'
type _TypeCheck1 = AssertTypeImplements<typeof isValidActionType, typeof isValidAction>
