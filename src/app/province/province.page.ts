import {Component, OnInit} from '@angular/core';
import {ApiService} from '../service/api.service';
import {ListRegioni} from '../models/list-regioni';
import {BehaviorSubject} from 'rxjs';
import {Riepilogoregioni} from '../models/riepilogoregioni';
import * as d3 from 'd3';
import {ChartData} from '../models/chart-data';
import {Regioni} from '../models/regioni';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {PathNavigatorSupportService} from '../service/path-navigator-support.service';

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
  viewId = 2;

  constructor(
      public api: ApiService,
      private router: Router,
      public pathNavigatorSupport: PathNavigatorSupportService
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

  onSwipeLeft($event) {
    const path = this.pathNavigatorSupport.getPreviousPath(this.viewId);
    this.router.navigate([path]);
  }

  onSwipeRight($event) {
    const path = this.pathNavigatorSupport.getNextPath(this.viewId);
    this.router.navigate([path]);
  }

  ngOnInit(): void {
    console.log(this.pathNavigatorSupport.getNextPath(this.viewId));
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
            }
          ],
          colorScheme: d3.schemePaired,
          type: 'numeric'
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
          type: 'numeric'
        });

        this.chartData.push({
          title: 'Grafico percentuali',
          data,
          chartLines: [
            {
              field: 'percentuale_positivi_casi_giornaliera',
              title: 'Postivi / casi testati'
            },
            {
              field: 'percentuale_positivi_casi_7dma',
              title: 'Postivi / casi testati a 7 giorni'
            },
            // {
            //   field: 'percentuale_variazione_terapia_intensiva',
            //   title: 'Terapia intensiva'
            // },
            {
              field: 'percentuale_variazione_deceduti',
              title: 'Decessi'
            },
            {
              field: 'cfr',
              title: 'Case Fatality Rate'
            }
          ],
          colorScheme: d3.schemeOrRd[4],
          type: 'percentage'
        });

        this.chartData.push({
          title: 'Grafico A 7 giorni',
          data,
          chartLines: [
            {
              field: 'incidenza_7d',
              title: 'Incidenza'
            },
            {
              field: 'variazione_terapia_intensiva_7dma',
              title: 'Terapia intensiva'
            },
            {
              field: 'variazione_deceduti_7dma',
              title: 'Decessi'
            },
            {
              field: 'nuovi_positivi_7dma',
              title: 'Nuovi positivi'
            },
            {
              field: 'variazione_ricoverati_con_sintomi_7dma',
              title: 'Ricoveri'
            }
          ],
          colorScheme: d3.schemeOrRd[4],
          type: 'numeric'
        });
      }
    });
  }

}
