import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Ng2GoogleChartsModule} from 'ng2-google-charts';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {PinchZoomModule} from 'ngx-pinch-zoom';
import {GraficiComponent} from './grafici.component';
import {GraficiProvinceComponent} from './grafici-province/grafici-province.component';



@NgModule({
  declarations: [GraficiComponent, GraficiProvinceComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2GoogleChartsModule
  ],
  exports: [GraficiComponent, GraficiComponent, GraficiProvinceComponent]
})
export class GraficiComponentModule { }
