import { FrontendToPython, PythonToFrontend, StellarGlobeWidgetParams } from "./StellarGlobeWidget"

export type JsonSchema = {
  PythonToFrontend: PythonToFrontend & { StellarGlobeWidgetParams: StellarGlobeWidgetParams }
  FrontendToPython: FrontendToPython
}
