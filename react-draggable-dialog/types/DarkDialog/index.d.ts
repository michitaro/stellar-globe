import { DialogProps } from '../Dialog';
type Props = Omit<DialogProps, 'classNames' | 'fadeClassNames' | 'fadeDuration'> & {
    onCloseButtonClick?: () => void;
};
export declare function DarkDialog({ title: rawTitle, children, visible, positionHint, sizeHint, resizable, onCloseButtonClick, }: Props): import("react/jsx-runtime").JSX.Element;
export {};
