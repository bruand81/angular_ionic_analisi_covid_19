import {Component, OnInit} from '@angular/core';
import {ApiService} from '../service/api.service';
import {ListRegioni} from '../models/list-regioni';
import {BehaviorSubject} from 'rxjs';
import {Riepilogoregioni} from '../models/riepilogoregioni';
import * as d3 from 'd3';
import {ChartData} from '../models/chart-data';
import {Regioni} from '../models/regioni';

@Component({
  selector: 'app-tab2',
  templateUrl: 'province.page.html',
  styleUrls: ['province.page.scss']
})
export class ProvincePage implements OnInit{
  listRegioni: ListRegioni[];
  selectedRegion = 15;
  riepilogoRegioni = new BehaviorSubject<Riepilogoregioni[]>(null);
  chartData: ChartData[] = [];
  regioni: Regioni[];

  constructor(
      public api: ApiService,
  ) {}

  getListRegioni(){
    this.api.getListRegioni().subscribe((data) => {
      this.listRegioni = data;
    });
  }

  getLatestRegioni(value: number) {
    this.api.getLatestRegioni(value).subscribe((resp: any) => {
      this.regioni = resp.results;
    });
  }

  getRiepilogoRegioni(value: number) {
    this.api.getRiepilogoRegioni(value).subscribe((resp: any) => {
      this.riepilogoRegioni.next(resp);
    });
  }

  selectedRegionFn() {
    this.getLatestRegioni(this.selectedRegion);
    this.getRiepilogoRegioni(this.selectedRegion);
  }

  compareFn(e1: number, e2: number): boolean {
    return e1 && e2 ? e1 === e2 : e1 === e2;
  }

  ngOnInit(): void {
    this.getListRegioni();
    this.getLatestRegioni(this.selectedRegion);
    this.getRiepilogoRegioni(this.selectedRegion);
    this.riepilogoRegioni.subscribe((data) => {
      if (data) {
        this.chartData = [];
        this.chartData.push({
          title: 'Grafico di riepilogo',
          data,
          chartLines: [
            {
              field: 'nuovi_positivi',
              title: 'Nuovi positivi'
            },
            {
              field: 'nuovi_positivi_7dma',
              title: 'Nuovi positivi (7DMA)'
            },
            {
              field: 'nuovi_positivi_3dma',
              title: 'Nuovi positivi (3DMA)'
            },
            {
              field: 'incidenza_7d',
              title: 'Incidenza a 7gg /10000 abitanti'
            }
          ],
          colorScheme: d3.schemePaired,
        });

        this.chartData.push({
          title: 'Grafico carichi ospedalieri',
          data,
          chartLines: [
            {
              field: 'variazione_terapia_intensiva',
              title: 'Terapie intensive'
            },
            {
              field: 'variazione_ricoverati_con_sintomi',
              title: 'Ricoverati con sintomi'
            },
            {
              field: 'variazione_dimessi_guariti',
              title: 'Guariti'
            },
            {
              field: 'variazione_deceduti',
              title: 'Decessi'
            }
          ],
          colorScheme: d3.schemeOrRd[4],
        });
      }
    });
  }

}
