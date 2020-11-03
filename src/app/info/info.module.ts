import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfoPage } from './info.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { InfoPageRoutingModule } from './info-routing.module'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: InfoPage }]),
    InfoPageRoutingModule,
  ],
  declarations: [InfoPage]
})
export class InfoPageModule {}
