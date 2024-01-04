import { ReactNode, RefObject } from 'react';
import { Position, Size } from './types';
type ResizableProps = {
    children: ReactNode;
    position: Position | undefined;
    setPosition: React.Dispatch<React.SetStateAction<Position | undefined>>;
    setSize: React.Dispatch<React.SetStateAction<Size | undefined>>;
    container: RefObject<HTMLElement>;
    minSize?: Size;
};
export declare function Resizable({ children, container, setPosition, setSize, minSize, }: ResizableProps): import("react/jsx-runtime").JSX.Element;
export {};
