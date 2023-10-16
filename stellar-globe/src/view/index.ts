import { MvpMatrix } from "./MvpMatrix"

export class View {
  constructor(
    readonly mvp: MvpMatrix,
    readonly lodBias: number,
    readonly retina: boolean,
    readonly drawingBufferHeight: number,
  ) {
  }
}
