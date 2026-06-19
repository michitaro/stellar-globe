import { JupyterFrontEnd } from '@jupyterlab/application'
import type { KernelType } from '@stellar-globe/jupyterlab-bridge'

export type { CommType, KernelType } from '@stellar-globe/jupyterlab-bridge'
export type StellarGlobeSessionEnv = {
  kernel: KernelType
  app: JupyterFrontEnd
}
