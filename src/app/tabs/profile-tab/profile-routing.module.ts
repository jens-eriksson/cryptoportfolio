import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileTab } from './profile.tab';
import { ProfilePage } from './profile/profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileTab,
    children: [
      {
        path: '',
        component: ProfilePage,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
