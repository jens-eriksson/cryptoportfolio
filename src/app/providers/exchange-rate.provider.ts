/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */

import { ExchangeRate } from './../model/exchange-rate';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FirestoreProvider } from './firestore.provider';

@Injectable()
export class ExchangeRateProvider extends FirestoreProvider<ExchangeRate>  {
    private apiKey = '719410038f307fb58f7a';

    constructor(private http: HttpClient) {
        super('exchange-rates');
    }

    async updateRates() {
      const seconds = Date.now() / 1000;

      try {
        const usdsek = await this.get('USDSEK');
        if (usdsek.timestamp.seconds + 3600 < seconds) {
            const url = 'https://free.currconv.com/api/v7/convert?apiKey=' + this.apiKey + '&q=USD_SEK&compact=ultra';
            const res = await this.http.get(url).toPromise<any>();
            const rate: ExchangeRate = {
                id: 'USDSEK',
                rate: res.USD_SEK,
                timestamp: new Date()
            };
            await this.set(rate);
        }
      }
      catch(err) {
        console.error(err);
      }

      try {
        const ethusd = await this.get('ETHUSD');
        if (!ethusd || ethusd.timestamp.seconds + 3600 < seconds) {
            const url = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
            const res = await this.http.get(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json' })}).toPromise();

            const rate: ExchangeRate = {
                id: 'ETHUSD',
                rate: res['ethereum'].usd,
                timestamp: new Date()
            };
            await this.set(rate);
        }
      }
      catch(err) {
        console.error(err);
      }
    }
}
