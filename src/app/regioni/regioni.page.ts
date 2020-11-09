import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../service/api.service';
import {Regioni} from '../models/regioni';
import {Riepilogoregioni} from '../models/riepilogoregioni';
import {BehaviorSubject} from 'rxjs';
import * as d3 from 'd3';
import {DatePipe} from '@angular/common';
import {ChartData} from '../models/chart-data';
import {LoadingController} from '@ionic/angular';
import {PathNavigatorSupportService} from '../service/path-navigator-support.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'regioni.page.html',
  styleUrls: ['regioni.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegioniPage implements OnInit{
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  countValue: string;
  nextPage: string;
  previousPage: string;
  regioni: Regioni[];
  riepilogoRegioni = new BehaviorSubject<Riepilogoregioni[]>(null);
  public showContent = false;
  public openIcon = 'chevron-down-outline';
  public cardContentStyle = 'display: none';
  chartData: ChartData[] = [];
  dataAggiornamento = '-';
  loading: HTMLIonLoadingElement;
  tableFields = {
    denominazioneregione : 'denominazione_regione',
    tamponisupositivi : 'percentuale_positivi_tamponi_giornaliera',
    casisupositivi : 'percentuale_positivi_casi_giornaliera',
    decessi : 'variazione_deceduti',
    ti : 'variazione_terapia_intensiva',
    ricoverati : 'variazione_ricoverati_con_sintomi',
    guariti : 'variazione_dimessi_guariti',
    incidenza7G : 'incidenza_7d',
    cfr : 'cfr'
  };
  viewId = 1;

  constructor(
      public api: ApiService,
      private router: Router,
      public datepipe: DatePipe,
      public loadingController: LoadingController,
      public pathNavigatorSupport: PathNavigatorSupportService
  ) {}

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Caricamento dati...',
      duration: 1000
    });
    await this.loading.present();
    //
    const { role, data } = await this.loading.onDidDismiss();
    // console.log('Loading dismissed!');
  }

  onSort(event) {
    console.log('Sort Event');
    const field = this.tableFields[event.sorts[0].prop];
    const dir = event.sorts[0].dir;
    console.log(event.sorts[0].prop);
    console.log(field);
    let sortedList = this.regioni.sort((a, b) => (a[field] > b[field]) ? 1 : -1);
    if (dir === 'desc') {
      sortedList = sortedList.reverse();
    }
    this.regioni = sortedList;
  }

  getLatestRegioni() {
    this.api.getLatestRegioni().subscribe((resp: any) => {
      this.countValue = resp.count;
      this.nextPage = resp.next;
      this.previousPage = resp.previous;
      this.regioni = resp.results;
    });
  }

  getRiepilogoRegioni(value: number) {
    this.api.getRiepilogoRegioni(value).subscribe((resp: any) => {
      this.riepilogoRegioni.next(resp);
    });
  }

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

  switchContent(){
    this.showContent = !this.showContent;
    if (this.showContent){
      this.openIcon = 'chevron-up-outline';
      this.cardContentStyle = 'display: block';
    } else {
      this.openIcon = 'chevron-down-outline';
      this.cardContentStyle = 'display: none';
    }
  }

  initOrRefresh(){
    this.presentLoading();
    this.riepilogoRegioni.subscribe((data) => {
      if (data) {
        if (this.loading){
          this.loading.dismiss().then(r => console.log('Loading dismissed'));
        }
        this.dataAggiornamento = this.datepipe.transform(data[data.length - 1].data, 'fullDate');
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
              field: 'percentuale_variazione_terapia_intensiva',
              title: 'Terapia intensiva'
            },
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
      }
    });
    this.getLatestRegioni();
    this.getRiepilogoRegioni(0);
  }

  onSwipeLeft($event) {
    const path = this.pathNavigatorSupport.getPreviousPath(this.viewId);
    this.router.navigate([path]);
  }

  onSwipeRight($event) {
    const path = this.pathNavigatorSupport.getNextPath(this.viewId);
    this.router.navigate([path]);
  }

  ngOnInit() {
    console.log(this.pathNavigatorSupport.getNextPath(this.viewId));
    this.initOrRefresh();
  }
}
