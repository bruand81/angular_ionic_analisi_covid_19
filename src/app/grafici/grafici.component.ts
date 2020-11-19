import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Riepilogoregioni} from '../models/riepilogoregioni';
import {ChartsInterface} from './charts-interface';
import {BehaviorSubject} from 'rxjs';
import {DatePipe, PercentPipe} from '@angular/common';
import {PathNavigatorSupportService} from '../service/path-navigator-support.service';
import {Platform} from '@ionic/angular';
import {GoogleChartsDataTable} from 'ng2-google-charts/lib/google-charts-datatable';

@Component({
  selector: 'app-grafici',
  templateUrl: './grafici.component.html',
  styleUrls: ['./grafici.component.scss'],
})
export class GraficiComponent implements OnInit {
  @Input() data = new BehaviorSubject<Riepilogoregioni[]>(null);
  @Input() height: number;
  @Output() clickRefresh: EventEmitter<any> = new EventEmitter<any>();
  public charts: ChartsInterface[];
  public numCol = 2;
  constructor(
      public datepipe: DatePipe,
      public percentage: PercentPipe,
      public platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.resize(this.platform.width());
      this.platform.resize.subscribe(() => {
        this.resize(this.platform.width());
      });
    });
  }

  resize(width: number) {
    if (width > 500){
      this.numCol = 2;
    } else {
      this.numCol = 1;
    }
  }

  refresh() {
    this.clickRefresh.emit();
  }

  loadGroupAreaChart() {
    // console.log('loadGroupAreaChart');
    this.data.subscribe((dt) => {
      if (dt) {
        // console.log(dataset);
        // console.log(this.graphHeight);
        const formatters = [{
              columns: [0],
              type: 'DateFormat',
              options: {
                pattern: 'dd MMM'
              }
            }
          ];
        const options = {
          legend: {
            position: 'top',
            alignment: 'center'
          },
          pointsVisible: true,
          tooltip: {
            trigger: 'focus'
          },
          crosshair: {
            trigger: 'selection'
          },
          height: this.height,
          width: '100%',
          chartArea: {
            height: '70%',
            width: '70%'
          },
          hAxis: {
            slantedText: true,
            slantedTextAngle: 20,
          },

        };
        this.charts = [];
        let dataTable = [];
        dataTable.push([
          ['domain', 'Data'],
          ['number', 'Nuovi positivi'],
          {type: 'number', role: 'annotation'},
          ['number', 'Nuovi positivi (3DMA)'],
          {type: 'number', role: 'annotation'},
          ['number', 'Nuovi positivi (3DMA)'],
          {type: 'number', role: 'annotation'}]);
        dt.forEach((value) => {
          const date = this.datepipe.transform(value.data, 'dd, MMM');
          dataTable.push([date,
            value.nuovi_positivi, value.nuovi_positivi,
            value.nuovi_positivi_3dma, value.nuovi_positivi_3dma,
            value.nuovi_positivi_7dma, value.nuovi_positivi_7dma]);
        });
        this.charts.push({
          title: 'Riepilogo',
          chart: {
            chartType: 'AreaChart',
            dataTable,
            formatters,
            options,
          }
        });

        dataTable = [];
        dataTable.push([
          ['domain', 'Data'],
          ['number', 'Incidenza'],
          {type: 'number', role: 'annotation'},
          ['number', 'Terapia intensiva'],
          {type: 'number', role: 'annotation'},
          ['number', 'Decessi'],
          {type: 'number', role: 'annotation'},
          ['number', 'Ricoveri'],
          {type: 'number', role: 'annotation'}, ]);
        dt.forEach((value) => {
          const date = this.datepipe.transform(value.data, 'dd, MMM');
          dataTable.push([date,
            value.incidenza_7d, value.incidenza_7d,
            value.variazione_terapia_intensiva_7dma, value.variazione_terapia_intensiva_7dma,
            value.variazione_deceduti_7dma, value.variazione_deceduti_7dma,
            value.variazione_ricoverati_con_sintomi_7dma, value.variazione_ricoverati_con_sintomi_7dma]);
        });
        this.charts.push({
          title: 'Andamento a 7 giorni',
          chart: {
            chartType: 'AreaChart',
            dataTable,
            formatters,
            options,
          }
        });

        dataTable = [];
        dataTable.push([
          ['domain', 'Data'],
          ['number', 'Terapia intensiva'],
          {type: 'number', role: 'annotation'},
          ['number', 'Ricoveri'],
          {type: 'number', role: 'annotation'},
          ['number', 'Decessi'],
          {type: 'number', role: 'annotation'}, ]);
        dt.forEach((value) => {
          const date = this.datepipe.transform(value.data, 'dd, MMM');
          dataTable.push([date,
            value.variazione_terapia_intensiva, value.variazione_terapia_intensiva,
            value.variazione_ricoverati_con_sintomi, value.variazione_ricoverati_con_sintomi,
            value.variazione_deceduti, value.variazione_deceduti]);
        });
        this.charts.push({
          title: 'Carichi ospedalieri',
          chart: {
            chartType: 'AreaChart',
            dataTable,
            formatters,
            options,
          }
        });

        dataTable = [];
        dataTable.push([
          ['domain', 'Data'],
          ['number', 'Positivi/Casi'],
          {type: 'string', role: 'annotation'},
          ['number', 'Positivi/Casi - 7g'],
          {type: 'string', role: 'annotation'},
          ['number', 'Decessi'],
          {type: 'string', role: 'annotation'},
          ['number', 'Case Fatality Rate'],
          {type: 'string', role: 'annotation'},]);
        dt.forEach((value) => {
          const date = this.datepipe.transform(value.data, 'dd, MMM');
          dataTable.push([
              date,
            value.percentuale_positivi_casi_giornaliera, this.percentage.transform(value.percentuale_positivi_casi_giornaliera),
            value.percentuale_positivi_casi_7dma, this.percentage.transform(value.percentuale_positivi_casi_7dma),
            value.percentuale_variazione_deceduti, this.percentage.transform(value.percentuale_variazione_deceduti),
            value.cfr, this.percentage.transform(value.cfr)]);
        });
        this.charts.push({
          title: 'Percentuali',
          chart: {
            chartType: 'AreaChart',
            dataTable,
            formatters,
            options,
          }
        });
      }
    });
  }

  ngOnInit() {
    this.loadGroupAreaChart();
  }

}
