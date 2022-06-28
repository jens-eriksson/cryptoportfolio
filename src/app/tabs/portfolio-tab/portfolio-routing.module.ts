import { Univ3LpPositionPage } from './univ3-lp-position/univ3-lp-position.page';
import { EditPortfoliosPage } from './edit-portfolios/edit-portfolios.page';
import { EditHoldingPage } from './edit-holding/edit-holding.page';
import { AddHoldingPage } from './add-holding/add-holding.page';
import { AddPortfolioPage } from './edit-portfolios/add-portfolio/add-portfolio.page';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioTab } from './portfolio.tab';
import { PortfolioPage } from './portfolio/portfolio.page';

const routes: Routes = [
  {
    path: '',
    component: PortfolioTab,
    children: [
      {
        path: '',
        component: PortfolioPage
      },
      {
        path: 'add-portfolio',
        component: AddPortfolioPage
      },
      {
        path: 'edit',
        component: EditPortfoliosPage
      },
      {
        path: 'univ3/:id',
        component: Univ3LpPositionPage
      },
      {
        path: ':portfolioId/holding/:id',
        component: EditHoldingPage
      },
      {
        path: ':portfolioId/add-holding',
        component: AddHoldingPage
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfolioRoutingModule {}
