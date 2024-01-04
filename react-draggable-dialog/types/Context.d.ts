import { ReactNode } from "react";
import { Position, Rect, Size } from "./types";
export type DialogState = {
    rect: Rect;
    visible: boolean;
};
type ContextType = {
    portal?: HTMLElement;
    dialogs: Map<number, DialogState>;
    nextPosition: (size: Size) => Position;
    zIndex: Map<number, number>;
    raiseWindow: (id: number) => void;
};
type Props = {
    children: ReactNode;
    portal?: HTMLElement;
    positionStart?: Position;
};
export declare function DialogContext({ children, portal, }: Props): import("react/jsx-runtime").JSX.Element;
export declare function useDialogContext(): ContextType;
export declare function useZIndex(id: number): number;
export {};
