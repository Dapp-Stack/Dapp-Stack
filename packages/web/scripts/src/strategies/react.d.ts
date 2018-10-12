import { Signale } from 'signale';
import { IWebStrategy } from '../types';
export declare class React implements IWebStrategy {
    private signale;
    private child;
    constructor(signale: Signale);
    start: () => void;
    build: () => Promise<void>;
    eject: () => void;
    test: () => void;
    stop: () => void;
}
//# sourceMappingURL=react.d.ts.map