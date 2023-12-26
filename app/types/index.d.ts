import { default as default_2 } from 'react';
import { Globe } from '@stellar-globe/stellar-globe';

declare const App: default_2.FC<AppProps & { ref: unknown }>;
export default App;

export declare type AppHandle = {
    globe: () => Globe
    dispatchAction: (action: { type: string, payload: unknown }) => void
}

declare type AppProps = {
    hashSync?: boolean
    storageSync?: boolean
    catchAllKeyboardEvents?: boolean
}

export { }
