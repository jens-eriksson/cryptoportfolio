import { AuthProvider } from './../../../auth/auth.provider';
import { PortfolioProvider } from '../../../providers/portfolio.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Portfolio } from 'src/app/model/portfolio';
import { ItemReorderEventDetail } from '@ionic/core';

@Component({
  selector: 'app-edit-portfolios',
  templateUrl: './edit-portfolios.page.html',
  styleUrls: ['./edit-portfolios.page.scss'],
})
export class EditPortfoliosPage implements OnInit {
  portfolios: Portfolio[];

  constructor(
    private route: ActivatedRoute,
    private portfolioProvider: PortfolioProvider,
    private auth: AuthProvider,
    private router: Router,
    ) { }

  ngOnInit() {
    this.portfolioProvider.obseveCollection({
      conditions: [{ field: 'uid', op: '==', value: this.auth.uid()}], orderBy: 'index'
      }).subscribe(portfolios => {
    this.portfolios = portfolios;
  });
  }

  doReorder(ev) {
    const portfolio = this.portfolios.splice(ev.detail.from, 1)[0];
    this.portfolios.splice(ev.detail.to, 0, portfolio);
    let i = 0;
    for (const p of this.portfolios) {
      p.index = i;
      i++;
    }
    ev.detail.complete();
  }

  addPortfolio() {
    this.router.navigate(['/tabs/portfolios/add-portfolio']);
  }

  save() {
    for (const p of this.portfolios) {
      this.portfolioProvider.update(p);
    }
  }

  delete(id) {
      this.portfolioProvider.delete(id);
  }
}
