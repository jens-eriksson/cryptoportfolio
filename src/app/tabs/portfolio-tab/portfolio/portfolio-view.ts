export interface PortfolioView {
    name: string;
    sumUSD: number;
    sumSEK: number;
    assets: [
        {
            ticker: string;
            amount: number;
            price: number;
            purchasePrice: number;
            change24h: number;
            USD: number;
            SEK: number;
        }
    ];
}
