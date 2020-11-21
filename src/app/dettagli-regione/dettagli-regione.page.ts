import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ListRegioni} from '../models/list-regioni';
import {ApiService} from '../service/api.service';
import {Province} from '../models/province';
import {DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import * as d3 from 'd3';
import {Router} from '@angular/router';
import {PathNavigatorSupportService} from '../service/path-navigator-support.service';
import {GoogleChartInterface} from 'ng2-google-charts';

@Component({
  selector: 'app-dettagli-regione',
  templateUrl: './dettagli-regione.page.html',
  styleUrls: ['./dettagli-regione.page.scss'],
})
export class DettagliRegionePage implements OnInit, AfterViewInit {
  pageTitle = 'Dettagli regione';
  listRegioni: ListRegioni[];
  selectedRegion = 15;
  province: Province[];
  latestProvince: Province[];
  public showContent = false;
  public openIcon = 'chevron-down-outline';
  public cardContentStyle = 'display: none';
  codiciProvince: number[];
  dataset = [];
  chartLabels = [];
  colorScale = d3.schemePaired;
  lineChart: any;
  tableFields = {
    denominazioneprovincia : 'denominazione_provincia',
    totalecasi : 'totale_casi',
    variazionetotalecasi : 'variazione_totale_casi',
    percentualevariazionetotalecasi : 'percentuale_variazione_totale_casi',
    incidenza : 'incidenza',
    incidenza7D : 'incidenza_7d'
  };
  viewId = 3;
  tableChart: GoogleChartInterface;

  constructor(
      public api: ApiService,
      public datepipe: DatePipe,
      private decimalPipe: DecimalPipe,
      private percentPipe: PercentPipe,
      private router: Router,
      public pathNavigatorSupport: PathNavigatorSupportService
  ) { }

  ngAfterViewInit(): void {
      this.getListProvinceInRegione(this.selectedRegion);
  }

  getListRegioni(){
    this.api.getListRegioni().subscribe((data) => {
      this.listRegioni = data.results;
    });
  }

  getListProvinceInRegione(value: number) {
    this.api.getProvinceInRegione(value).subscribe((data) => {
      this.province = data.results;
      const maxdate = data.results[0].data;
      this.latestProvince = data.results.filter((provincia) => {
        return provincia.data === maxdate;
      });
      this.tableChart = this.drawTable();
      this.codiciProvince = this.latestProvince.filter(
          (thing, i, arr) => arr.findIndex(t => t.codice_provincia === thing.codice_provincia) === i
      ). map<number>((item) => item.codice_provincia);
    });
  }

  selectedRegionFn() {
    localStorage.setItem('selectedRegion', JSON.stringify(this.selectedRegion));
    console.log('Region changed: ' + this.selectedRegion);
    this.getListProvinceInRegione(this.selectedRegion);
    this.refresh();
  }

  compareFn(e1: number, e2: number): boolean {
    return e1 && e2 ? e1 === e2 : e1 === e2;
  }

  drawTable(): GoogleChartInterface {
    if (this.latestProvince) {
      let denum = 0;

      const dataTable: any[] = [];
      const headerRow = [
        'ID',
        'Regione',
        'Provincia',
        'Variazione casi',
        'Percentuale variazione casi',
        'Variazione casi a 3 giorni',
        'Variazione casi a 7 giorni',
        'Incidenza / 100.000 ab',
        'Incidenza a 7 giorni / 100.000 ab',
      ];
      dataTable.push(headerRow);

      const maxPerColumns: number[] = new Array(headerRow.length);
      const minPerColumns: number[] = new Array(headerRow.length);
      const avgPerColumns: number[] = new Array(headerRow.length);
      maxPerColumns.fill(0);
      minPerColumns.fill(0);
      avgPerColumns.fill(0);

      this.latestProvince.forEach(value => {
        const row = [
          value.codice_provincia, // 0
          value.denominazione_regione, // 1
          value.denominazione_provincia, // 2
          value.variazione_totale_casi, // 3
          value.percentuale_variazione_totale_casi, // 4
          value.variazione_totale_casi_3dma, // 5
          value.variazione_totale_casi_7dma, // 6
          value.incidenza, // 7
          value.incidenza_7d // 8
        ];
        const ids = [3, 4, 5, 6, 7, 8];
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

      avgPerColumns.forEach((value, idx) => {
        if (value > 0) {
          avgPerColumns[idx] = value / denum;
        }
      });

      const colorFormatColumnsGreenToRedCol = [3, 4, 5, 6];
      const colorFormatColumnsRedToGreenCol = [7, 8];
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
          columns: [3, 5],
          type: 'NumberFormat',
          options: {
            fractionDigits: 0,
          }
        },
        {
          columns: [4],
          type: 'NumberFormat',
          options: {
            fractionDigits: 2,
            pattern: '#.##%'
          }
        },
        {
          columns: [7, 8],
          type: 'BarFormat'
        }
      ];

      colorFormats.forEach(value => {
        formatters.push(value);
      });
      const view = {columns: [0,  2, 3, 4, 5, 6, 7, 8]};

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

  onSwipeLeft($event) {
    const path = this.pathNavigatorSupport.getPreviousPath(this.viewId);
    this.router.navigate([path]);
  }

  onSwipeRight($event) {
    const path = this.pathNavigatorSupport.getNextPath(this.viewId);
    this.router.navigate([path]);
  }

  ngOnInit() {
    this.selectedRegion = JSON.parse(localStorage.getItem('selectedRegion') ) || 1;
    this.getListRegioni();
  }

  refresh() {
    this.getListRegioni();
    window.location.reload();
  }
}
