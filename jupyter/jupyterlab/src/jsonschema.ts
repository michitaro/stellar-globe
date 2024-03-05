import { FrontendToPython, PythonToFrontend, StellarGlobeWidgetParams } from "./StellarGlobeWidget"


type AddValidatorName<A, B extends string> = A & { __validatorName__: B }
type ValidatorMap<T extends Record<string, any>> = {
  [K in keyof T]: AddValidatorName<T[K], K & string>
}


export type PythonToFrontendJsonSchema = ValidatorMap<
  PythonToFrontend & { StellarGlobeWidgetParams: StellarGlobeWidgetParams }
>


export type JsonSchema = {
  PythonToFrontend: PythonToFrontend & { StellarGlobeWidgetParams: StellarGlobeWidgetParams }
  FrontendToPython: FrontendToPython
}
