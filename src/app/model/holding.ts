import { Asset } from './asset';

export interface Holding extends Asset {
    amount: number;
    priceUSD: number;
    change24h: number;
    valueUSD: number;
    valueSEK: number;
    valueETH: number;
    checkAmount?: boolean;
    amountUrl?: string;
}
