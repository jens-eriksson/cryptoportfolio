import { AssetProvider } from './../../../providers/asset.provider';
import { PortfolioProvider } from './../../../providers/portfolio.provider';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Holding } from '../../../model/holding';
import { Asset } from '../../../model/asset';

@Component({
  selector: 'app-edit-holding',
  templateUrl: './edit-holding.page.html',
  styleUrls: ['./edit-holding.page.scss'],
})
export class EditHoldingPage implements OnInit {
  portfolio;
  holding: Holding;
  assets: Asset[];
  showAdvanced = false;

  constructor(
    private route: ActivatedRoute,
    private portfolioProvider: PortfolioProvider,
    private assetProvider: AssetProvider
    ) { }

  ngOnInit() {
    this.portfolioProvider.get(this.route.snapshot.params.portfolioId).then(portfolio => {
      this.portfolio = portfolio;
      this.holding = portfolio.holdings.find(h => h.id === this.route.snapshot.params.id);
    });
    this.assetProvider.all().then(assets => {
      this.assets = assets.filter(a => !a.isCalculated);
    });
  }

  save() {
    if (this.holding && this.portfolio.id) {
      const index = this.portfolio.holdings.findIndex(h => h.id === this.holding.id);
      if (index === -1) {
        this.portfolio.holdings.push(this.holding);
      } else {
        this.portfolio.holdings[index] = this.holding;
      }
      this.portfolioProvider.update(this.portfolio);
    }
  }

  deleteAsset() {
    if (this.holding && this.portfolio.id) {
      this.portfolio.holdings = this.portfolio.holdings.filter(h => h.id !== this.holding.id);
      this.portfolioProvider.set(this.portfolio);
    }
  }
}
