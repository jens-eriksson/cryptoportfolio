import { Holding } from './../../../model/holding';
import { Asset } from './../../../model/asset';
import { AssetProvider } from './../../../providers/asset.provider';
import { PortfolioProvider } from '../../../providers/portfolio.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-holding',
  templateUrl: './add-holding.page.html',
  styleUrls: ['./add-holding.page.scss'],
})
export class AddHoldingPage implements OnInit {
  portfolio;
  assets: Asset[];
  holding: Holding;
  showAdvanced = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private portfolioProvider: PortfolioProvider,
    private assetProvider: AssetProvider
    ) {
    }

  ngOnInit() {
    this.holding = {
      id: null,
      name: null,
      symbol: null,
      amount: null,
      priceUSD: null,
      change24h: null,
      valueUSD: null,
      valueSEK: null,
      valueETH: null,
      isCalculated: false,
      baseAsset: null,
      convertionRate: null,
      checkAmount: false,
      amountUrl: null,
    };
    this.portfolioProvider.get(this.route.snapshot.params.portfolioId).then(portfolio => {
      this.portfolio = portfolio;
    });
    this.assetProvider.all().then(assets => {
      this.assets = assets;
    });
  }

  save() {
    if (this.holding) {
      const asset = this.assets.find(a => a.id === this.holding.id);
      this.holding.name = asset.name;
      this.holding.symbol = asset.symbol;
      if (asset.isCalculated) {
        this.holding.isCalculated = true;
        this.holding.baseAsset = asset.baseAsset;
        this.holding.convertionRate = asset.convertionRate;
      }
      this.holding.chain = asset.chain ? asset.chain : null;
      this.holding.contract = asset.contract ? asset.contract : null;

      if (this.holding && this.portfolio.id) {
        const index = this.portfolio.holdings.findIndex(h => h.id === this.holding.id);
        if (index === -1) {
          this.portfolio.holdings.push(this.holding);
        } else {
          this.portfolio.holdings[index] = this.holding;
        }
        this.portfolioProvider.update(this.portfolio);
        this.router.navigateByUrl('/tabs/portfolios');
      }
    }
  }

  disabled() {
    if (this.holding.id && (this.holding.amount || this.holding.amount === 0)) {
      return false;
    } else {
      return true;
    }
  }
}
