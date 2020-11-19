import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Riepilogoregioni} from '../models/riepilogoregioni';
import {ChartsInterface} from './charts-interface';
import {BehaviorSubject} from 'rxjs';
import {DatePipe} from '@angular/common';
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
        dataTable.push(['Data', 'Nuovi positivi', 'Nuovi positivi (3DMA)', 'Nuovi positivi (3DMA)']);
        dt.forEach((value) => {
          const date = this.datepipe.transform(value.data, 'dd, MMM');
          dataTable.push([date, value.nuovi_positivi, value.nuovi_positivi_3dma, value.nuovi_positivi_7dma]);
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
        dataTable.push(['Data', 'Incidenza', 'Terapia intensiva', 'Decessi', 'Ricoveri']);
        dt.forEach((value) => {
          const date = this.datepipe.transform(value.data, 'dd, MMM');
          dataTable.push([date, value.incidenza_7d, value.variazione_terapia_intensiva_7dma, value.variazione_deceduti_7dma,
            value.variazione_ricoverati_con_sintomi_7dma]);
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
        dataTable.push(['Data', 'Terapia intensiva', 'Ricoveri', 'Decessi']);
        dt.forEach((value) => {
          const date = this.datepipe.transform(value.data, 'dd, MMM');
          dataTable.push([date, value.variazione_terapia_intensiva, value.variazione_ricoverati_con_sintomi,
            value.variazione_deceduti]);
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
        dataTable.push(['Data', 'Positivi/Casi', 'Positivi/Casi - 7g', 'Decessi', 'Case Fatality Rate']);
        dt.forEach((value) => {
          const date = this.datepipe.transform(value.data, 'dd, MMM');
          dataTable.push([date, value.percentuale_positivi_casi_giornaliera, value.percentuale_positivi_casi_7dma,
            value.percentuale_variazione_deceduti, value.cfr]);
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
