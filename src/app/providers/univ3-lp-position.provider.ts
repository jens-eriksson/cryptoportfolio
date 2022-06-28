/* eslint-disable @typescript-eslint/dot-notation */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Univ3LpPosition, Univ3SubgraphPositionData } from './../model/univ3-lp-position';
import { ExchangeRateProvider } from './exchange-rate.provider';
import { FirestoreProvider } from './firestore.provider';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { BigNumber as bn} from 'bignumber.js';
import { ExchangeRate } from '../model/exchange-rate';

@Injectable()
export class Univ3LpPositionProvider extends FirestoreProvider<Univ3LpPosition> {

    constructor(private http: HttpClient, private rates: ExchangeRateProvider) {
        super('univ3-lp-position');
    }

    public async update(position: Univ3LpPosition): Promise<Univ3LpPosition> {
        console.log('Univ3LpPositionProvider.update()');

        const ethusd = await this.rates.get('ETHUSD');
        const usdsek = await this.rates.get('USDSEK');
        const data = await this.getPositionDataFromSubgraph(Number.parseInt(position.id, 10));

        this.updateTokens(position, data, ethusd);
        this.updateLiquidity(position, data, ethusd, usdsek);
        this.updateUnclaimedFees(position, data, ethusd, usdsek);
        // this.updateUnclaimedFees2(position, data, ethusd, usdsek);
        this.updateBalance(position, data, ethusd, usdsek);
        this.updatePoolData(position, data, usdsek);
        this.updateValue(position, data);
        this.updateProfit(position, data);

        await this.set(position);

        return position;
    }

    private updateTokens(posistion: Univ3LpPosition, data: Univ3SubgraphPositionData, ethusd: ExchangeRate) {
      posistion.token0 = {
        symbol: data.position.token0.symbol,
        priceToken1: data.position.pool.token1Price,
        minPriceToken1: data.position.tickLower.price0,
        maxPriceToken1: data.position.tickUpper.price0,
        priceUSD: data.position.token0.derivedETH * ethusd.rate
      };

      posistion.token1 = {
        symbol: data.position.token1.symbol,
        priceToken0: data.position.pool.token0Price,
        minPriceToken0: data.position.tickUpper.price1,
        maxPriceToken0: data.position.tickLower.price1,
        priceUSD: data.position.token1.derivedETH * ethusd.rate
      };
    }

    private updateLiquidity(position: Univ3LpPosition, data: Univ3SubgraphPositionData, ethusd: ExchangeRate, usdsek: ExchangeRate) {
      const liquidity = data.position.liquidity;
      const minPrice = data.position.tickLower.price0;
      const maxPrice = data.position.tickUpper.price0;
      const price = data.position.pool.token1Price;

      const amount0 = liquidity * ((Math.sqrt(maxPrice) - Math.sqrt(price)) / (Math.sqrt(price) * Math.sqrt(maxPrice))) /
                      10**data.position.token0.decimals;
      const amount1 = liquidity * (Math.sqrt(price) - Math.sqrt(minPrice)) /
                      10**data.position.token1.decimals;

      position.liquidity = {
        amount: {
          token0: amount0,
          token1: amount1
        }
      };

      const ratioToken0 = position.liquidity.amount.token0 /
            (position.liquidity.amount.token0 +
                position.liquidity.amount.token1 *
                position.token1.priceToken0);
      const ratioToken1 = position.liquidity.amount.token1 /
          (position.liquidity.amount.token1 +
              position.liquidity.amount.token0 *
              position.token0.priceToken1);

      position.liquidity.ratio = {
        token0: ratioToken0,
        token1: ratioToken1
      };

      position.liquidity.value = {
        token0: position.liquidity.amount.token0 + position.liquidity.amount.token1 * position.token1.priceToken0,
        token1: position.liquidity.amount.token1 + position.liquidity.amount.token0 * position.token0.priceToken1,
        usd: (position.liquidity.amount.token0 * data.position.token0.derivedETH + position.liquidity.amount.token1 *
              data.position.token1.derivedETH) * ethusd.rate,
        sek: (position.liquidity.amount.token0 * data.position.token0.derivedETH + position.liquidity.amount.token1 *
              data.position.token1.derivedETH) * ethusd.rate * usdsek.rate
      };
    }

    private updateBalance(position: Univ3LpPosition, data: Univ3SubgraphPositionData, ethusd: ExchangeRate, usdsek: ExchangeRate) {
      position.balance.value = {
        token0: position.balance.amount.token0 + position.balance.amount.token1 * position.token1.priceToken0,
        token1: position.balance.amount.token1 + position.balance.amount.token0 * position.token0.priceToken1,
        usd: (position.balance.amount.token0 * data.position.token0.derivedETH + position.balance.amount.token1 *
              data.position.token1.derivedETH) * ethusd.rate,
        sek: (position.balance.amount.token0 * data.position.token0.derivedETH + position.balance.amount.token1 *
              data.position.token1.derivedETH) * ethusd.rate * usdsek.rate
      };
    }

    private updateUnclaimedFees(position: Univ3LpPosition, data: Univ3SubgraphPositionData, ethusd: ExchangeRate, usdsek: ExchangeRate) {
      const liquidity = new bn(data.position.liquidity);

      const feeGrowthGlobal0 = new bn(data.position.pool.feeGrowthGlobal0X128).div(new bn(2).pow(128));
      const feeGrowthOutside0Lower = new bn(data.position.tickLower.feeGrowthOutside0X128).div(new bn(2).pow(128));
      const feeGrowthOutside0Upper = new bn(data.position.tickUpper.feeGrowthOutside0X128).div(new bn(2).pow(128));
      const feeGrowthInside0Last = new bn(data.position.feeGrowthInside0LastX128).div(new bn(2).pow(128));

      const feeGrowthGlobal1 = new bn(data.position.pool.feeGrowthGlobal1X128).div(new bn(2).pow(128));
      const feeGrowthOutside1Lower = new bn(data.position.tickLower.feeGrowthOutside1X128).div(new bn(2).pow(128));
      const feeGrowthOutside1Upper = new bn(data.position.tickUpper.feeGrowthOutside1X128).div(new bn(2).pow(128));
      const feeGrowthInside1Last = new bn(data.position.feeGrowthInside1LastX128).div(new bn(2).pow(128));

      const tokensOwed0 = feeGrowthGlobal0
        .minus(feeGrowthOutside0Lower)
        .minus(feeGrowthOutside0Upper)
        .minus(feeGrowthInside0Last)
        .times(liquidity)
        .div(new bn(10**data.position.token0.decimals));

      const tokensOwed1 = feeGrowthGlobal1
        .minus(feeGrowthOutside1Lower)
        .minus(feeGrowthOutside1Upper)
        .minus(feeGrowthInside1Last)
        .times(liquidity)
        .div(new bn(10**data.position.token1.decimals));

      position.unclaimedFees = {
        amount: {
          token0: tokensOwed0.toNumber(),
          token1: tokensOwed1.toNumber()
        }
      };

      position.unclaimedFees.value = {
        token0: position.unclaimedFees.amount.token0 + position.unclaimedFees.amount.token1 * position.token1.priceToken0,
        token1: position.unclaimedFees.amount.token1 + position.unclaimedFees.amount.token0 * position.token0.priceToken1,
        usd: (position.unclaimedFees.amount.token0 * data.position.token0.derivedETH + position.unclaimedFees.amount.token1 *
          data.position.token1.derivedETH) * ethusd.rate,
        sek: (position.unclaimedFees.amount.token0 * data.position.token0.derivedETH + position.unclaimedFees.amount.token1 *
              data.position.token1.derivedETH) * ethusd.rate * usdsek.rate
      };
    }

    private updateUnclaimedFees2(position: Univ3LpPosition, data: Univ3SubgraphPositionData, ethusd: ExchangeRate, usdsek: ExchangeRate) {
      const liquidity = data.position.liquidity;

      const feeGrowthGlobal0X128 = data.position.pool.feeGrowthGlobal0X128;
      const feeGrowthOutside0X128Lower = data.position.tickLower.feeGrowthOutside0X128;
      const feeGrowthOutside0X128Upper = data.position.tickUpper.feeGrowthOutside0X128;
      const feeGrowthInside0LastX128 = data.position.feeGrowthInside0LastX128;

      const feeGrowthGlobal1X128 = data.position.pool.feeGrowthGlobal1X128;
      const feeGrowthOutside1X128Lower = data.position.tickLower.feeGrowthOutside1X128;
      const feeGrowthOutside1X128Upper = data.position.tickUpper.feeGrowthOutside1X128;
      const feeGrowthInside1LastX128 = data.position.feeGrowthInside1LastX128;

      const feetoken0 =
        ((feeGrowthGlobal0X128 - feeGrowthOutside0X128Lower - feeGrowthOutside0X128Upper - feeGrowthInside0LastX128)/(2**128))
          *liquidity/(1*10**data.position.token0.decimals);

      const feetoken1 =
        ((feeGrowthGlobal1X128 - feeGrowthOutside1X128Lower - feeGrowthOutside1X128Upper - feeGrowthInside1LastX128)/(2**128))
          *liquidity/(1*10**data.position.token1.decimals);

      // console.log(data.position.token0.symbol + ': ' +  feetoken0);
      // console.log(data.position.token1.symbol + ': ' +  feetoken1);
    }

    private updateValue(position: Univ3LpPosition, data: Univ3SubgraphPositionData) {
      position.value = {
        token0: position.balance.value.token0 + position.liquidity.value.token0,
        token1: position.balance.value.token1 + position.liquidity.value.token1,
        usd: position.balance.value.usd + position.liquidity.value.usd,
        sek: position.balance.value.sek + position.liquidity.value.sek,
      };
    }

    private updateProfit(position: Univ3LpPosition, data: Univ3SubgraphPositionData) {
      position.profit = {
        token0: position.liquidity.value.token0 - position.principle.value.token0,
        token1: position.liquidity.value.token1 - position.principle.value.token1,
        usd: position.liquidity.value.usd - position.principle.value.usd,
        sek: position.liquidity.value.sek - position.principle.value.sek,
      };
    }

    private updatePoolData(posistion: Univ3LpPosition, data: Univ3SubgraphPositionData, usdsek: any) {
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const days = [];
      let sumVolume = 0;
      let sumTvl = 0;
      let sumFeesUSD = 0;

      data.position.pool.poolDayData.forEach(day => {
        const date = new Date(day.date * 1000);
        const dateString = date.getDate() + '/' + (date.getMonth() + 1);
        days.push({
          date: dateString,
          weekday: weekdays[date.getDay()],
          volumeMUSD: day.volumeUSD / 1000000,
          feesUSD: day.feesUSD,
          feesSEK: day.feesUSD * usdsek.rate,
          tvlMUSD: day.tvlUSD / 1000000,
          ratio: day.volumeUSD / day.tvlUSD
        });
        sumVolume += day.volumeUSD / 1000000;
        sumFeesUSD += day.feesUSD;
        sumTvl += day.tvlUSD / 1000000;
      });

      posistion.poolData = {
          days,
          sumVolumeMUSD: sumVolume,
          sumFeesUSD,
          sumFeesSEK: sumFeesUSD * usdsek.rate,
          avgFeesUSD: sumFeesUSD / days.length,
          avgFeesSEK: sumFeesUSD * usdsek.rate / days.length,
          avgVolumeMUSD: sumVolume / days.length,
          avgTvlMUSD: sumTvl /days.length,
          ratio7d: sumVolume / sumTvl
      };

      posistion.poolData.days.reverse();
    }

    private async getPositionDataFromSubgraph(id: number) {
      const APIURL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

      const query = `
        query ($id: Int) {
          position(id: $id) {
            id
            token0 {
              symbol
              decimals
              derivedETH
            }
            token1 {
              symbol
              decimals
              derivedETH
            }
            liquidity
            depositedToken0
            depositedToken1
            withdrawnToken0
            withdrawnToken1
            feeGrowthInside0LastX128
            feeGrowthInside1LastX128
            tickLower {
              price0
              price1
              feeGrowthOutside0X128
              feeGrowthOutside1X128
            }
            tickUpper {
              price0
              price1
              feeGrowthOutside0X128
              feeGrowthOutside1X128
            }
            pool {
              token0Price
              token1Price
              feeGrowthGlobal0X128
              feeGrowthGlobal1X128
              poolDayData(first: 7, orderBy: date, orderDirection: desc) {
                  date
                  volumeUSD
                  tvlUSD
                  feesUSD
              }
            }
          }
        }
      `;

      const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
      });

      const result = await client.query<Univ3SubgraphPositionData>({
        query: gql(query),
        variables: {
          id
        }
      });
      return result.data;
    }
}
