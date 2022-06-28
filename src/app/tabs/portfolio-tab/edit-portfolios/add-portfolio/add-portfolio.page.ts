import { Router } from '@angular/router';
import { AuthProvider } from './../../../../auth/auth.provider';
import { PortfolioProvider } from '../../../../providers/portfolio.provider';
import { Component, OnInit } from '@angular/core';
import { Portfolio } from '../../../../model/portfolio';

@Component({
  selector: 'app-add-portfolio',
  templateUrl: './add-portfolio.page.html',
  styleUrls: ['./add-portfolio.page.scss'],
})
export class AddPortfolioPage implements OnInit {
  name;

  constructor(
    private portfolioProvider: PortfolioProvider,
    private auth: AuthProvider,
    private router: Router
    ) {
    }

  ngOnInit() {
  }

  async add() {
    if (this.name) {
      const portfolio: Portfolio = {
        id: null,
        name: this.name,
        uid: this.auth.uid(),
        holdings: [],
        sumSEK: 0,
        sumUSD: 0,
        sumETH: 0,
        index: await this.portfolioProvider.nextIndex(this.auth.uid())
      };
      this.portfolioProvider.set(portfolio).then(() => {
        this.router.navigateByUrl('/tabs/portfolios/edit');
      });
    }
  }
}
