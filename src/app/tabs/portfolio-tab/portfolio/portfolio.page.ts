import { Univ3LpPositionProvider } from './../../../providers/univ3-lp-position.provider';
import { Univ3LpPosition } from './../../../model/univ3-lp-position';
import { AuthProvider } from './../../../auth/auth.provider';
import { ExchangeRate } from './../../../model/exchange-rate';
import { Router, ActivatedRoute } from '@angular/router';
import { Portfolio } from './../../../model/portfolio';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PortfolioProvider } from '../../../providers/portfolio.provider';
import { ExchangeRateProvider } from '../../../providers/exchange-rate.provider';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-portfolio',
  templateUrl: 'portfolio.page.html',
  styleUrls: ['portfolio.page.scss'],
})
export class PortfolioPage implements OnInit {
  @ViewChild('slides', {static: true}) slides: IonSlides;
  title = '';
  updated;
  errorMessage;
  portfolios: Portfolio[];
  lpPositions: Univ3LpPosition[];
  index = 0;
  usdsek: ExchangeRate;
  isUpdating = [];
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(
    private portfolioProvider: PortfolioProvider,
    private exchangeRateProvider: ExchangeRateProvider,
    private univ3Provider: Univ3LpPositionProvider,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthProvider
    ) {
  }

  async ngOnInit() {
    this.index = 0;

    //Update all portfolios
    const temp = await this.portfolioProvider.query({
      conditions: [{ field: 'uid', op: '==', value: this.auth.uid()}], orderBy: 'index'
      });

    for(const p of temp) {
      await this.update(p);
    }

    this.portfolioProvider.obseveCollection({
      conditions: [{ field: 'uid', op: '==', value: this.auth.uid()}], orderBy: 'index'
      }).subscribe({
      next: portfolios => {
        this.portfolios = portfolios;
        this.title = this.portfolios[this.index].name;
        this.getLpPositions(this.portfolios[this.index].id);
      },
      error: error => { console.error(error); }
    });
  }

  async slideChanged(event) {
    this.index = await this.slides.getActiveIndex();
    const portfolio = this.portfolios[this.index];
    if (portfolio) {
      this.title = portfolio.name;
      await this.getLpPositions(portfolio.id);
      if (this.isUpdating.filter(id => id === portfolio.id).length === 0) {
        this.update(portfolio);
      }
    }
  }

  refresh(event) {
    const portfolio = this.portfolios[this.index];
    if (portfolio && this.isUpdating.filter(id => id === portfolio.id).length === 0) {
      this.update(portfolio).then(() => {
        event.target.complete();
      });
    } else {
      event.target.complete();
    }
  }

  editHolding(id) {
    const portfolioId = this.portfolios[this.index].id;
    this.router.navigate(['./' + portfolioId + '/holding/' + id], { relativeTo: this.route });
  }

  editLpPosition(id) {
    this.router.navigate(['./univ3/' + id], { relativeTo: this.route });
  }

  editPortfolios() {
    this.router.navigate(['/tabs/portfolios/edit']);
  }

  addHolding() {
    const id = this.portfolios[this.index].id;
    this.router.navigate(['./' + id + '/add-holding'], { relativeTo: this.route });
  }

  async getLpPositions(portfolioId: string) {
    this.lpPositions = await this.univ3Provider.query({
      conditions: [{ field: 'uid', op: '==', value: this.auth.uid()}, { field: 'portfolioId', op: '==', value: portfolioId}]
    });
  }

  async update(portfolio: Portfolio) {
    this.isUpdating.push(portfolio.id);
    try {
      await this.exchangeRateProvider.updateRates();
      this.usdsek = await this.exchangeRateProvider.get('USDSEK');
    } catch (err) {
      console.error(err);
    }

    try {
      await this.portfolioProvider.update(portfolio);
      const now = new Date();
      this.updated = this.getDateString(now);
    } catch (err) {
      console.error(err);
      this.updated= 'UNABLE TO UPDATE';
      this.isUpdating = this.isUpdating.filter(id => id !== portfolio.id);
    }
    this.isUpdating = this.isUpdating.filter(id => id !== portfolio.id);
  }

  private getDateString(date: Date): string {
    const yyyy = date.getFullYear().toString();
    const MM = date.getMonth() + 1 > 9  ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    const dd = date.getDate() > 9  ? date.getDate() : '0' + date.getDate();
    const hh = date.getHours() > 9  ? date.getHours() : '0' + date.getHours();
    const mm = date.getMinutes() > 9  ? date.getMinutes() : '0' + date.getMinutes();
    const ss = date.getSeconds() > 9  ? date.getSeconds() : '0' + date.getSeconds();

    return yyyy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss;
  }
}
