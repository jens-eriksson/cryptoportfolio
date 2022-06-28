import { Univ3LpPositionPage } from './univ3-lp-position/univ3-lp-position.page';
import { VolumeChartComponent } from './univ3-lp-position/volume-chart/volume-chart.component';
import { EditPortfoliosPage } from './edit-portfolios/edit-portfolios.page';
import { AddPortfolioPage } from './edit-portfolios/add-portfolio/add-portfolio.page';
import { AddHoldingPage } from './add-holding/add-holding.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PortfolioTab } from './portfolio.tab';
import { PortfolioPage } from './portfolio/portfolio.page';
import { EditHoldingPage } from './edit-holding/edit-holding.page';
import { PortfolioRoutingModule } from './portfolio-routing.module';
import { TvlChartComponent } from './univ3-lp-position/tvl-chart/tvl-chart.component';
import { RatioChartComponent } from './univ3-lp-position/ratio-chart/ratio-chart.component';
import { FeesChartComponent } from './univ3-lp-position/fees-chart/fees-chart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PortfolioRoutingModule
  ],
  declarations: [
    PortfolioTab,
    PortfolioPage,
    EditHoldingPage,
    EditPortfoliosPage,
    AddHoldingPage,
    AddPortfolioPage,
    Univ3LpPositionPage,
    VolumeChartComponent,
    TvlChartComponent,
    RatioChartComponent,
    FeesChartComponent
  ]
})
export class PortfolioModule {}
