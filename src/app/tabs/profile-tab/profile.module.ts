import { ProfilePage } from './profile/profile.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileRoutingModule } from './profile-routing.module';

import { ProfileTab } from './profile.tab';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileRoutingModule
  ],
  declarations: [
    ProfileTab,
    ProfilePage
  ]
})
export class ProfileModule {}
