import { PortfolioProvider } from './../../../providers/portfolio.provider';
import { Univ3LpPosition } from './../../../model/univ3-lp-position';
import { Univ3LpPositionProvider } from './../../../providers/univ3-lp-position.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-univ3-lp-position',
  templateUrl: './univ3-lp-position.page.html',
  styleUrls: ['./univ3-lp-position.page.scss'],
})
export class Univ3LpPositionPage implements OnInit {
  position: Univ3LpPosition;
  invertPrice = false;

  constructor(
    private route: ActivatedRoute,
    private univ3Provider: Univ3LpPositionProvider,
    private portfolioProvider: PortfolioProvider
    ) {
    }

  ngOnInit() {
    this.univ3Provider.get(this.route.snapshot.params.id).then(position => {
      this.position = position;
    });
  }

  refresh(event) {
    this.univ3Provider.update(this.position).then(position => {
      this.position = position;
      event.target.complete();
    });

    this.portfolioProvider.get(this.position.portfolioId).then(portfolio => {
      this.portfolioProvider.update(portfolio);
    });
  }
}
