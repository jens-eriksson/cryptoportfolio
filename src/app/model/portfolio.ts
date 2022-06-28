import { Holding } from './holding';

export interface Portfolio {
    id: string;
    name: string;
    uid: string;
    sumUSD: number;
    sumSEK: number;
    sumETH: number;
    holdings: Holding[];
    index?: number;
}

