import {Component, Input, OnInit} from '@angular/core';
import {Regioni} from '../models/regioni';
import {ApiService} from '../service/api.service';
import {DecimalPipe, PercentPipe} from '@angular/common';

@Component({
  selector: 'app-dati-essenziali',
  templateUrl: './dati-essenziali.component.html',
  styleUrls: ['./dati-essenziali.component.scss'],
})
export class DatiEssenzialiComponent implements OnInit {
  @Input() data: Regioni;
  @Input() isRegion = true;

  constructor(
      private decimalPipe: DecimalPipe,
      private percentPipe: PercentPipe
  ) { }

  // percentage(value: number): string{
  //   try {
  //     return (value * 100).toFixed(2) + '%';
  //   } catch (err) {
  //     return 'NN';
  //   }
  // }
  //
  // formatatRate(value: number, numerator: number, denominator: number): string {
  //   return this.percentage(value) + ' (' + numerator + '/' + denominator + ')';
  // }

  ngOnInit() {}

  getSign(sign: number): number {
    if (sign >= 0) {
      return 1;
    } else {
      return -1;
    }
  }

  getColorForField(value: number, field: string): string {
    let min = 0;
    let max = 10;
    let sign = 1;
    switch (field){
      case 'percentuale_positivi_tamponi_giornaliera':
        min = 0.08;
        max = 0.15;
        sign = 1;
        break;
      case 'percentuale_positivi_casi_giornaliera':
        min = 0.08;
        max = 0.15;
        sign = 1;
        break;
      case 'nuovi_positivi':
        if (this.isRegion){
          min = 500;
          max = 1000;
          sign = 1;
        } else {
          min = 2000;
          max = 20000;
          sign = 1;
        }
        break;
      case 'variazione_deceduti':
        if (this.isRegion){
          min = 0;
          max = 100;
          sign = 1;
        } else {
          min = 0;
          max = 500;
          sign = 1;
        }
        break;
      case 'variazione_terapia_intensiva':
        if (this.isRegion){
          min = 0;
          max = 20;
          sign = 1;
        } else {
          min = 0;
          max = 150;
          sign = 1;
        }
        break;
      case 'ingressi_terapia_intensiva':
        if (this.isRegion){
          min = 0;
          max = 20;
          sign = 1;
        } else {
          min = 0;
          max = 150;
          sign = 1;
        }
        break;
      case 'variazione_ricoverati_con_sintomi':
        if (this.isRegion){
          min = 0;
          max = 100;
          sign = 1;
        } else {
          min = 0;
          max = 500;
          sign = 1;
        }
        break;
      case 'cfr':
        min = 0.01;
        max = 0.04;
        sign = 1;
        break;
      case 'incidenza_7d':
        min = 20;
        max = 100;
        sign = 1;
        break;
      case 'variazione_dimessi_guariti':
        if (this.isRegion){
          min = -500;
          max = 0;
          sign = -1;
        } else {
          min = -2000;
          max = 0;
          sign = -1;
        }
        break;
      default:
        min = 0;
        max = 10;
        sign = 1;
        break;
    }
    return this.getColorWithThreshold(value, min, max, sign);
  }

  getColorWithThreshold(value: number, min?: number, max?: number, sign?: number): string {
    min = (typeof min === 'undefined') ? 0 : min;
    max = (typeof max === 'undefined') ? 10 : max;
    sign = (typeof sign === 'undefined') ? 1 : this.getSign(sign);
    value = value * sign;
    if (value <= min) {
      return 'success';
    } else if (value <= max) {
      return 'warning';
    }
    return 'danger';
  }

}
