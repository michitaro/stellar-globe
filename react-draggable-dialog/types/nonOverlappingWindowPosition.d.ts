import { Position, Rect, Size } from "./types";
type nonOverlappingWindowPositionOptions = {
    margin?: number;
    container?: Rect;
    corners?: `${'top' | 'bottom'}${'Right' | 'Left'}`[];
};
export declare function nonOverlappingWindowPosition(rects: Rect[], size: Size, options?: nonOverlappingWindowPositionOptions): Position;
export declare function fallback(rects: Rect[], size: Size, options: {
    margin: number;
    container: Rect;
}): Position;
export {};
