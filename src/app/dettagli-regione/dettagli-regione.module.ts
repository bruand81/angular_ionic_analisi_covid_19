import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DettagliRegionePageRoutingModule } from './dettagli-regione-routing.module';

import { DettagliRegionePage } from './dettagli-regione.page';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SwipeModule} from '../swipe/swipe.module';
import {GraficiComponentModule} from '../grafici/grafici-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DettagliRegionePageRoutingModule,
    NgxDatatableModule,
    SwipeModule,
      GraficiComponentModule
  ],
  declarations: [DettagliRegionePage]
})
export class DettagliRegionePageModule {}
