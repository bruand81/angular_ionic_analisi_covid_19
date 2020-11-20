import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../service/api.service';
import {Regioni} from '../models/regioni';
import {Riepilogoregioni} from '../models/riepilogoregioni';
import {BehaviorSubject} from 'rxjs';
// import * as d3 from 'd3';
import {DatePipe, PercentPipe} from '@angular/common';
// import {ChartData} from '../models/chart-data';
import {LoadingController, Platform} from '@ionic/angular';
import {PathNavigatorSupportService} from '../service/path-navigator-support.service';
import {Router} from '@angular/router';
import {GoogleChartInterface} from 'ng2-google-charts';
import {ColorFormatInterface, FormatterInterface} from 'ng2-google-charts/lib/google-charts-datatable';
// import {GoogleChartInterface} from 'ng2-google-charts';

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
  // public cardContentStyle = 'display: none';
  // chartData: ChartData[] = [];
  dataAggiornamento = '-';
  loading: HTMLIonLoadingElement;
  // public groupAreaChart: GoogleChartInterface;
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
    // console.log('resized');
    this.initOrRefresh();
  }

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

  getIndexOfCountry(value: number): number {
    const regionComparator = (element: Regioni) => element.codice_regione === value;

    if (this.regioni) {
      return this.regioni.findIndex(regionComparator);
    }
    return null;
}

  // onSort(event) {
  //   console.log('Sort Event');
  //   const field = this.tableFields[event.sorts[0].prop];
  //   const dir = event.sorts[0].dir;
  //   console.log(event.sorts[0].prop);
  //   console.log(field);
  //   let sortedList = this.regioni.sort((a, b) => (a[field] > b[field]) ? 1 : -1);
  //   if (dir === 'desc') {
  //     sortedList = sortedList.reverse();
  //   }
  //   this.regioni = sortedList;
  // }

  getLatestRegioni() {
    this.api.getLatestRegioni().subscribe((resp: any) => {
      this.countValue = resp.count;
      this.nextPage = resp.next;
      this.previousPage = resp.previous;
      this.regioni = resp.results;
      this.tableChart = this.drawTable();
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

  drawTable(): GoogleChartInterface {
    if (this.regioni) {
      let denum = 0;

      const dataTable: any[] = [];
      const headerRow = [
        'ID',
        'Regione',
        'Percentuale Positivi/Tamponi',
        'Percentuale Positivi/Casi testati',
        'Decessi',
        'Terapia Intensiva',
        'Ricoverati con sintomi',
        'Guariti',
        'Incidenza a 7 giorni / 100.000 ab',
        'CFR',
        'percentuale_positivi_tamponi_giornaliera',
        'percentuale_positivi_casi_giornaliera',
        'nuovi_positivi',
        'variazione_tamponi',
        'variazione_casi_testati'
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
          value.variazione_casi_testati
        ];
        const ids = [2, 3, 4, 5, 6, 7, 8, 9];
        ids.forEach(id => {
          if (minPerColumns[id] > row[id]){
            minPerColumns[id] = (row[id] as number);
          }
          if (maxPerColumns[id] < row[id]){
            maxPerColumns[id] = (row[id] as number);
          }
          avgPerColumns[id] += (row[id] as number);
          denum += 1;
        });
        dataTable.push(row);
      });
      // console.log(dataTable);

      avgPerColumns.forEach((value, idx) => {
        if (value > 0) {
          avgPerColumns[idx] = value / denum;
        }
      });
      const colorFormatColumnsGreenToRedCol = [2, 3, 4, 5, 6, 8];
      const colorFormatColumnsRedToGreenCol = [7, 9];
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
        {
          columns: [0],
          type: 'NumberFormat',
          options: {
            fractionDigits: 0
          }
        },
        {
          columns: [4, 5, 6, 7, 8],
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
          columns: [8, 9],
          type: 'BarFormat'
        },
        {
          columns: [10, 12, 13],
          type: 'PatternFormat',
          options: {
            pattern: '{0} ({1} su {2})',
            dstColumnIndex: 2,
          }
        },
        {
          columns: [11, 12, 14],
          type: 'PatternFormat',
          options: {
            pattern: '{0} ({1} su {2})',
            dstColumnIndex: 3,
          }
        }
      ];

      colorFormats.forEach(value => {
        formatters.push(value);
      });
      const view = {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]};

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
    // console.log(this.pathNavigatorSupport.getNextPath(this.viewId));
    this.initOrRefresh();
  }
}
