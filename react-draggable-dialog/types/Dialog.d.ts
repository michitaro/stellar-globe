import { CSSProperties, ReactNode } from 'react';
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition';
import { Position } from './types';
export type DialogProps = {
    title: ReactNode;
    children: ReactNode;
    resizable?: boolean;
    positionHint?: CSSPosition;
    sizeHint?: CSSSize;
    classNames: ClassNames;
    visible?: boolean;
    fadeDuration?: number;
    fadeClassNames?: CSSTransitionClassNames;
};
type CSSPosition = Pick<CSSProperties, 'top' | 'left' | 'right' | 'bottom'>;
type CSSSize = Pick<CSSProperties, 'width' | 'height'>;
type ClassNames = {
    dialog?: string;
    titlebar?: string;
    content?: string;
    active?: string;
};
export declare function Dialog(props: DialogProps): import("react").ReactPortal;
export declare function DnDContent({ children, title, classNames: $classNames, position, positionHint, sizeHint, setPosition, visible, fadeClassNames, fadeDuration, }: DialogProps & {
    position: Position | undefined;
    setPosition: React.Dispatch<React.SetStateAction<Position | undefined>>;
}): import("react/jsx-runtime").JSX.Element;
export {};
