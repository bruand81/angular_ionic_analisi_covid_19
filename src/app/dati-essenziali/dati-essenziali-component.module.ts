import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {DatiEssenzialiComponent} from './dati-essenziali.component';



@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [DatiEssenzialiComponent],
  exports: [DatiEssenzialiComponent]
})
export class DatiEssenzialiComponentModule { }
