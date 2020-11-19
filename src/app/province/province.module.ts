import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProvincePage } from './province.page';

import { ProvincePageRoutingModule } from './province-routing.module';
import {RegioniPageRoutingModule} from '../regioni/regioni-routing.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {DrawChartsComponentModule} from '../draw-charts/draw-charts-component.module';
import {DatiEssenzialiComponentModule} from '../dati-essenziali/dati-essenziali-component.module';
import {SwipeModule} from '../swipe/swipe.module';
import {GraficiComponentModule} from '../grafici/grafici-component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DrawChartsComponentModule,
    DatiEssenzialiComponentModule,
    ProvincePageRoutingModule,
    NgxDatatableModule,
    SwipeModule,
    GraficiComponentModule
  ],
  declarations: [ProvincePage],
})
export class ProvincePageModule {}
