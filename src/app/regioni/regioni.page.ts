import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../service/api.service';
import {Regioni} from '../models/regioni';
import {Riepilogoregioni} from '../models/riepilogoregioni';
import {BehaviorSubject} from 'rxjs';
import {DatePipe, PercentPipe} from '@angular/common';
import {LoadingController, Platform} from '@ionic/angular';
import {PathNavigatorSupportService} from '../service/path-navigator-support.service';
import {Router} from '@angular/router';
import {GoogleChartInterface} from 'ng2-google-charts';

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
  graphHeight = 400;
  tableChart: GoogleChartInterface;

  constructor(
      public api: ApiService,
      private router: Router,
      public datepipe: DatePipe,
      public percent: PercentPipe,
      public loadingController: LoadingController,
      public pathNavigatorSupport: PathNavigatorSupportService,
      public platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.graphHeight = platform.width() * .50;
      this.platform.resize.subscribe(() => {
        this.resizeContent();
      });
    });
  }

  resizeContent(){
    this.initOrRefresh();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Caricamento dati...',
      duration: 1000
    });
    await this.loading.present();
    const { role, data } = await this.loading.onDidDismiss();
  }

  getIndexOfCountry(value: number): number {
    const regionComparator = (element: Regioni) => element.codice_regione === value;

    if (this.regioni) {
      return this.regioni.findIndex(regionComparator);
    }
    return null;
  }

  getLatestRegioni() {
    this.api.getLatestRegioni().subscribe((resp: any) => {
      this.countValue = resp.count;
      this.nextPage = resp.next;
      this.previousPage = resp.previous;
      this.regioni = resp.results;
      this.dataAggiornamento =  `Dati aggiornati al ${this.datepipe.transform(this.regioni[0].data, 'longDate')}`;
      this.tableChart = this.drawTable();
    });
  }

  getRiepilogoRegioni(value: number) {
    this.api.getRiepilogoRegioni(value).subscribe((resp: any) => {
      this.riepilogoRegioni.next(resp.results);
    });
  }

  drawTable(): GoogleChartInterface {
    if (this.regioni) {
      let denum = 0;

      const dataTable: any[] = [];
      const headerRow = [
        'ID', // 0
        'Regione', // 1
        'Percentuale Positivi/Tamponi', // 2
        'Percentuale Positivi/Casi testati', // 3
        'Decessi', // 4
        'Terapia Intensiva', // 5
        'Ricoverati con sintomi', // 6
        'Guariti', // 7
        'Incidenza a 7 giorni / 100.000 ab', // 8
        'CFR', // 9
        'percentuale_positivi_tamponi_giornaliera', // 10
        'percentuale_positivi_casi_giornaliera', // 11
        'nuovi_positivi', // 12
        'variazione_tamponi', // 13
        'variazione_casi_testati', // 14
        'Nuovi positivi (7g su 7g)', // 15
        'Terapia Intensiva (7g su 7g)', // 16
        'Decessi (7g su 7g)', // 17
        'Guariti (7g su 7g)', // 18
        'Ricoverati con sintomi (7g su 7g)', // 19
      ];
      dataTable.push(headerRow);

      const maxPerColumns: number[] = new Array(headerRow.length);
      const minPerColumns: number[] = new Array(headerRow.length);
      const avgPerColumns: number[] = new Array(headerRow.length);
      maxPerColumns.fill(0);
      minPerColumns.fill(0);
      avgPerColumns.fill(0);

      this.regioni.forEach(value => {
        const row = [
          value.codice_regione,
          value.denominazione_regione,
          value.percentuale_positivi_tamponi_giornaliera,
          value.percentuale_positivi_casi_giornaliera,
          value.variazione_deceduti,
          value.variazione_terapia_intensiva,
          value.variazione_ricoverati_con_sintomi,
          value.variazione_dimessi_guariti,
          value.incidenza_7d,
          value.cfr,
          this.percent.transform(value.percentuale_positivi_tamponi_giornaliera, '1.0-2'),
          this.percent.transform(value.percentuale_positivi_casi_giornaliera, '1.0-2'),
          value.nuovi_positivi,
          value.variazione_tamponi,
          value.variazione_casi_testati,
          value.nuovi_positivi_7d_incr,
          value.terapia_intensiva_7d_incr,
          value.deceduti_7d_incr,
          value.dimessi_guariti_7d_incr,
          value.ricoverati_con_sintomi_7d_incr,
        ];
        const ids = [2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19];
        const zerAvg = [15, 16, 17, 18, 19];
        ids.forEach(id => {
          if (minPerColumns[id] > row[id]){
            minPerColumns[id] = (row[id] as number);
          }
          if (maxPerColumns[id] < row[id]){
            maxPerColumns[id] = (row[id] as number);
          }
          if (!(id in zerAvg)) {
            avgPerColumns[id] += (row[id] as number);
          }
          denum += 1;
        });
        dataTable.push(row);
      });

      avgPerColumns.forEach((value, idx) => {
        if (value > 0) {
          avgPerColumns[idx] = value / denum;
        }
      });
      const colorFormatColumnsGreenToRedCol = [2, 3, 4, 5, 6, 8];
      const colorFormatColumnsRedToGreenCol = [7];
      const colorFormats = [];

      colorFormatColumnsGreenToRedCol.forEach(id => {
        colorFormats.push({
          columns: [id],
          type: 'ColorFormat',
          options: {
            ranges: [{
              from: minPerColumns[id] - 1,
              to: avgPerColumns[id],
              fromBgColor: '#ABEBC6',
              toBgColor: '#AED6F1'
            },
              {
                from: avgPerColumns[id],
                to: maxPerColumns[id] + 1,
                fromBgColor: '#AED6F1',
                toBgColor: '#F5B7B1'
              }
            ]
          }
        });
      });

      colorFormatColumnsRedToGreenCol.forEach(id => {
        colorFormats.push({
          columns: [id],
          type: 'ColorFormat',
          options: {
            ranges: [{
              from: minPerColumns[id] - 1,
              to: avgPerColumns[id] ,
              fromBgColor: '#F5B7B1',
              toBgColor: '#AED6F1'
            },
              {
                from: avgPerColumns[id],
                to: maxPerColumns[id] + 1,
                fromBgColor: '#AED6F1',
                toBgColor: '#ABEBC6'
              }
            ]
          }
        });
      });

      const formatters: any[] = [
        // {
        //   columns: [0],
        //   type: 'NumberFormat',
        //   options: {
        //     fractionDigits: 0
        //   }
        // },
        {
          columns: [0, 4, 5, 6, 7, 8, 15, 16, 17, 18, 19],
          type: 'NumberFormat',
          options: {
            fractionDigits: 0,
          }
        },
        {
          columns: [9],
          type: 'NumberFormat',
          options: {
            fractionDigits: 2,
            pattern: '#.##%'
          }
        },
        {
          columns: [ 8 ],
          type: 'BarFormat',
          options: {
            colorNegative: 'green',
            colorPositive: 'red',
            drawZeroLine: true,
            base: 100
          }
        },
        {
          columns: [ 9 ],
          type: 'BarFormat',
          options: {
            colorNegative: 'green',
            colorPositive: 'red',
            drawZeroLine: true,
            base: 0.03
          }
        },
        {
          columns: [18],
          type: 'BarFormat',
          options: {
            colorNegative: 'red',
            colorPositive: 'green',
            drawZeroLine: true
          }
        },
        {
          columns: [ 15, 16, 17, 19],
          type: 'BarFormat',
          options: {
            colorNegative: 'green',
            colorPositive: 'red',
            drawZeroLine: true
          }
        },
        {
          columns: [10, 12, 13],
          type: 'PatternFormat',
          options: {
            pattern: '<strong>{0}</strong>  ({1} su {2})',
            dstColumnIndex: 2,
          }
        },
        {
          columns: [11, 12, 14],
          type: 'PatternFormat',
          options: {
            pattern: '<strong>{0}</strong> ({1} su {2})',
            dstColumnIndex: 3,
          }
        },
      ];

      colorFormats.forEach(value => {
        formatters.push(value);
      });
      const view = {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19]};

      const options = {allowHtml: true};
      return {
        chartType: 'Table',
        dataTable,
        formatters,
        options,
        view
      };
    }
    return null;
  }

  initOrRefresh(){
    this.presentLoading();
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
    this.initOrRefresh();
  }
}
