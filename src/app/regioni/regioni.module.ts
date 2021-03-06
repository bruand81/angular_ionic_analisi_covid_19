import { IonicModule } from '@ionic/angular';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegioniPage } from './regioni.page';

import { RegioniPageRoutingModule } from './regioni-routing.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {DrawChartsComponentModule} from '../draw-charts/draw-charts-component.module';
import {DatiEssenzialiComponentModule} from '../dati-essenziali/dati-essenziali-component.module';
import {SwipeModule} from '../swipe/swipe.module';
// import {Ng2GoogleChartsModule} from 'ng2-google-charts';
import {GraficiComponentModule} from '../grafici/grafici-component.module';
import {Ng2GoogleChartsModule} from 'ng2-google-charts';
import {PinchZoomModule} from 'ngx-pinch-zoom';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DrawChartsComponentModule,
    DatiEssenzialiComponentModule,
    RegioniPageRoutingModule,
    SwipeModule,
    GraficiComponentModule,
    Ng2GoogleChartsModule,
    PinchZoomModule
  ],
    declarations: [RegioniPage],
})
export class RegioniPageModule {}
