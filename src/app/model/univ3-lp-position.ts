export interface Univ3LpPosition {
    id?: string;
    created?: Date;
    address: string;
    poolId: string;
    name: string;
    portfolioId: string;
    inRange?: boolean;
    token0?: {
        symbol: string;
        priceToken1: number;
        minPriceToken1: number;
        maxPriceToken1: number;
        priceUSD: number;
    };
    token1?: {
        symbol: string;
        priceToken0: number;
        minPriceToken0: number;
        maxPriceToken0: number;
        priceUSD: number;
    };
    principle: {
        amount: {
          token0: number;
          token1: number;
        };
        value?: {
            token0: number;
            token1: number;
            usd: number;
            sek: number;
        };
    };
    liquidity?: {
      amount: {
        token0: number;
        token1: number;
      };
      value?: {
          token0: number;
          token1: number;
          usd: number;
          sek: number;
      };
      ratio?: {
          token0: number;
          token1: number;
      };
    };
    unclaimedFees?: {
      amount: {
        token0: number;
        token1: number;
      };
      value?: {
          token0: number;
          token1: number;
          usd: number;
          sek: number;
      };
    };
    balance?: {
      amount: {
        token0: number;
        token1: number;
      };
      value?: {
          token0: number;
          token1: number;
          usd: number;
          sek: number;
      };
    };

    value?: {
        token0: number;
        token1: number;
        usd: number;
        sek: number;
    };

    profit?: {
        token0: number;
        token1: number;
        usd: number;
        sek: number;
    };

    poolData?: {
        days: {
            date: string;
            weekday: string;
            volumeMUSD: number;
            tvlMUSD: number;
            ratio: number;
            feesUSD: number;
            feesSEK: number;
        }[];
        sumVolumeMUSD: number;
        sumFeesUSD: number;
        sumFeesSEK: number;
        avgVolumeMUSD: number;
        avgFeesUSD: number;
        avgFeesSEK: number;
        avgTvlMUSD: number;
        ratio7d: number;
    };
}

export interface Univ3SubgraphPositionData {
  position: {
    id: number;
    token0: {
      symbol: string;
      decimals: number;
      derivedETH: number;
    };
    token1: {
      symbol: string;
      decimals: number;
      derivedETH: number;
    };
    liquidity: number;
    depositedToken0: number;
    depositedToken1: number;
    withdrawnToken0: number;
    withdrawnToken1: number;
    feeGrowthInside0LastX128: number;
    feeGrowthInside1LastX128: number;
    tickLower: {
      price0: number;
      price1: number;
      feeGrowthOutside0X128: number;
      feeGrowthOutside1X128: number;
    };
    tickUpper: {
      price0: number;
      price1: number;
      feeGrowthOutside0X128: number;
      feeGrowthOutside1X128: number;
    };
    pool: {
        token0Price: number;
        token1Price: number;
        feeGrowthGlobal0X128: number;
        feeGrowthGlobal1X128: number;
        poolDayData: {
            date: number;
            volumeUSD: number;
            tvlUSD: number;
            feesUSD: number;
        }[];
    };
  };
}
