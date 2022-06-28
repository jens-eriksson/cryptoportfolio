export interface Asset {
    id: string;
    name: string;
    symbol: string;
    isCalculated?: boolean;
    baseAsset?: string;
    convertionRate?: number;
    chain?: string;
    contract?: string;
}
