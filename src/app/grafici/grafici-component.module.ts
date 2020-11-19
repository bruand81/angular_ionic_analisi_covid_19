import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Ng2GoogleChartsModule} from 'ng2-google-charts';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {PinchZoomModule} from 'ngx-pinch-zoom';
import {GraficiComponent} from './grafici.component';



@NgModule({
  declarations: [GraficiComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2GoogleChartsModule
  ],
  exports: [GraficiComponent]
})
export class GraficiComponentModule { }
