type AddValidatorName<A, B extends string> = A & { __validatorName__: B }

type ValidatorMap<T extends Record<string, any>> = {
  [K in keyof T]: AddValidatorName<T[K], K & string>
}

import { PythonToFrontend } from '../interface'

export type PythonToFrontendValidatorJsonSchema = ValidatorMap<PythonToFrontend>

