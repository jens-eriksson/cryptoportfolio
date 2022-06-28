import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../auth/auth-guard.provider';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'portfolios',
        pathMatch: 'full'
      },
      {
        path: 'portfolios',
        loadChildren: () => import('./portfolio-tab/portfolio.module').then(m => m.PortfolioModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile-tab/profile.module').then(m => m.ProfileModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsRoutingModule {}
