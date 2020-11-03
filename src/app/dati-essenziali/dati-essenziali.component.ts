import {Component, Input, OnInit} from '@angular/core';
import {Regioni} from '../models/regioni';

@Component({
  selector: 'app-dati-essenziali',
  templateUrl: './dati-essenziali.component.html',
  styleUrls: ['./dati-essenziali.component.scss'],
})
export class DatiEssenzialiComponent implements OnInit {
  @Input() data: Regioni;

  constructor( ) { }

  percentage(value: number): string{
    try {
      return (value * 100).toFixed(2) + '%';
    } catch (err) {
      return 'NN';
    }
  }

  formatatRate(value: number, numerator: number, denominator: number): string {
    return this.percentage(value) + ' (' + numerator + '/' + denominator + ')';
  }

  ngOnInit() {}

}
