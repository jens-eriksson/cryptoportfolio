/* eslint-disable @typescript-eslint/naming-convention */
import { Univ3LpPositionProvider } from './univ3-lp-position.provider';
import { ExchangeRateProvider } from './exchange-rate.provider';
import { Portfolio } from './../model/portfolio';
import { Injectable } from '@angular/core';
import { FirestoreProvider } from './firestore.provider';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ExchangeRate } from '../model/exchange-rate';
import { Univ3LpPosition } from '../model/univ3-lp-position';

@Injectable()
export class PortfolioProvider extends FirestoreProvider<Portfolio> {

  constructor(
    private http: HttpClient,
    private exchangeRateProvider: ExchangeRateProvider,
    private positionProvider: Univ3LpPositionProvider
    ) {
    super('portfolios');
  }

  public async set(portfolio: Portfolio): Promise<Portfolio> {
    if (!portfolio.name) {
      throw new Error('No name provided');
    }
    return super.set(portfolio);
  }

  public async update(portfolio: Portfolio) {
    const usdsek = await this.exchangeRateProvider.get('USDSEK');
    const ethusd = await this.exchangeRateProvider.get('ETHUSD');
    const positions = await this.positionProvider.query({conditions: [{ field: 'portfolioId', op: '==', value: portfolio.id}]});

    await this.updateAmounts(portfolio);
    await this.updatePricesFromCoinGecko(portfolio);
    await this.updatePositions(positions);
    await this.updateSums(portfolio, positions, ethusd, usdsek);

    await this.set(portfolio);
  }

  public async nextIndex(uid): Promise<number> {
    const portfolios = await this.query({ conditions: [{field: 'uid', op: '==', value: uid}], orderBy: 'index'});
    let index = 0;
    if (portfolios.length > 0) {
      index = portfolios[portfolios.length - 1].index + 1;
    }
    return index;
  }

  private async updateAmounts(portfolio: Portfolio) {
    for (const holding of portfolio.holdings) {
      if (holding.checkAmount) {
        const res = await this.http.get(holding.amountUrl).toPromise<any>();
        holding.amount = res.result / 1000000000;
      }
    }
  }

  private async updatePricesFromCoinGecko(portfolio: Portfolio) {
    let tickers = '';
    for (const holding of portfolio.holdings) {
      if (holding.isCalculated) {
        tickers += holding.baseAsset + '%2C';
      } else {
        tickers += holding.id + '%2C';
      }
    }

    tickers = tickers.substring(0, tickers.length - 3);
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=' + tickers + '&vs_currencies=usd&include_24hr_change=true';
    const res = await this.http.get(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json' })}).toPromise();

    for (const holding of portfolio.holdings) {
      if (holding.isCalculated) {
        holding.priceUSD = res[holding.baseAsset].usd * holding.convertionRate;
        holding.change24h = res[holding.baseAsset].usd_24h_change / 100;
      } else {
        holding.priceUSD = res[holding.id].usd;
        holding.change24h = res[holding.id].usd_24h_change / 100;
      }
    }
  }

  private async updatePositions(positions: Univ3LpPosition[]) {
    for(const position of positions) {
      await this.positionProvider.update(position);
    }
  }

  private async updateSums(portfolio: Portfolio, positions: Univ3LpPosition[], ethusd: ExchangeRate, usdsek: ExchangeRate) {
    let sumSEK = 0;
    let sumUSD = 0;
    let sumETH = 0;

    for (const holding of portfolio.holdings) {
      holding.valueUSD = holding.priceUSD * holding.amount;
      holding.valueSEK = holding.valueUSD * usdsek.rate;
      holding.valueETH = holding.valueUSD / ethusd.rate;
      sumUSD += holding.valueUSD;
      sumSEK += holding.valueSEK;
      sumETH += holding.valueETH;
    }

    for(const position of positions) {
      sumUSD += position.value.usd;
      sumSEK += position.value.sek;
      sumETH += position.value.token1;
    }

    portfolio.sumETH = sumETH;
    portfolio.sumSEK = sumSEK;
    portfolio.sumUSD = sumUSD;
  }

  private idFromName(name): string {
    return name.toLowerCase()
                .trim()
                .split(' ').join('-')
                .split('å').join('a')
                .split('ä').join('a')
                .split('ö').join('o')
                .split('&').join('-')
                .split(':').join('-');

  }
}
