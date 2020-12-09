import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
export class GraficiComponent implements OnInit, AfterViewInit{
  @Input() data = new BehaviorSubject<Riepilogoregioni[]>(null);
  @Input() height: number;
  @Input() viewId: number;
  @Output() clickRefresh: EventEmitter<any> = new EventEmitter<any>();
  public charts: ChartsInterface[];
  public numCol = 2;
  showAnnotation: boolean[] = [];
  defaultShowAnnotationValue = false;

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

  chartSelectEvent(event) {
    console.log(event);
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

  getShowAnnotationFor(index: number): boolean{
    if (this.showAnnotation.length === index){
      this.showAnnotation.push(this.defaultShowAnnotationValue);
      return this.showAnnotation[index];
    } else if (this.showAnnotation.length < index) {
      return true;
    } else {
      return this.showAnnotation[index];
    }
  }

  switchShowAnnotationFor(index: number): boolean{
    let result = this.defaultShowAnnotationValue;
    if (this.showAnnotation.length > index){
      this.showAnnotation[index] = !this.showAnnotation[index];
      result =  this.showAnnotation[index];
    }
    localStorage.setItem('showAnnotationView_' + this.viewId, JSON.stringify(this.showAnnotation));
    this.loadGroupAreaChart();
    return result;
  }

  selectViewAnnotationInColumns(columns: any[], index: number): number[] {
    const result: number[] = [];
    const showAnnotation = this.getShowAnnotationFor(index);
    columns.forEach((value, idx) => {
      let added = false;
      if (typeof value === 'string' || 'role' in value) {
        if (value.role !== 'annotation') {
          result.push(idx);
          added = true;
        } else {
          if (showAnnotation) {
            result.push(idx);
            added = true;
          }
        }
      } else {
        result.push(idx);
        added = true;
      }
      // console.log(idx + ': ' + value + ' - ' + ('role' in value) + ' - ' + added);
    });
    // console.log(result);
    return result;
  }


  loadGroupAreaChart() {
    // console.log('loadGroupAreaChart');
    const tmpHeight = JSON.parse(localStorage.getItem('height_' + this.viewId));
    if (tmpHeight) {
      this.height = tmpHeight;
    }
    this.data.subscribe((dt) => {
      if (dt) {
        dt = dt.reverse();
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
          selectionMode: 'multiple',
          aggregationTarget: 'series',
          legend: {
            position: 'top',
            alignment: 'center'
          },
          pointsVisible: true,
          tooltip: {
            trigger: 'focus',
            showColorCode: true
          },
          animation: {
            duration: 10000,
            start: true,
            easing: 'inAndOut'
          },
          crosshair: {
            trigger: 'selection',
            opacity: 0.5
          },
          explorer: {
            actions:  ['dragToZoom', 'rightClickToReset'],
            maxZoomIn: 0.1,
            maxZoomOut: 8,
            zoomDelta: 1
          },
          height: this.height,
          // width: '100%',
          chartArea: {
            height: '70%',
            width: '80%'
          },
          hAxis: {
            slantedText: true,
            slantedTextAngle: 20,
          },
          vAxis: {}
        };
        this.charts = [];
        let dataTable = [];
        // const view = this.getShowAnnotationFor(this.charts.length) ? {columns: [0, 1, 2, 3, 4, 5, 6]} : {columns: [0, 1,  3,  5]};
        dataTable.push([
          ['domain', 'Data'],
          'Nuovi positivi',
          {type: 'number', role: 'annotation'},
          'Nuovi positivi (3DMA)',
          {type: 'number', role: 'annotation'},
          'Nuovi positivi (7DMA)',
          {type: 'number', role: 'annotation'}]);
        dt.forEach((value) => {
          const date = this.datepipe.transform(value.data, 'dd MMM');
          dataTable.push([date,
            value.nuovi_positivi,
            value.nuovi_positivi,
            value.nuovi_positivi_3dma,
            value.nuovi_positivi_3dma,
            value.nuovi_positivi_7dma,
            value.nuovi_positivi_7dma]);
        });
        let view = {columns: this.selectViewAnnotationInColumns(dataTable[0], this.charts.length)};
        this.charts.push({
          title: 'Riepilogo',
          chart: {
            chartType: 'AreaChart',
            dataTable,
            formatters,
            options,
            view
          }
        });

        dataTable = [];
        dataTable.push([
          ['domain', 'Data'],
          'Incidenza',
          {type: 'number', role: 'annotation'},
          'Terapia intensiva',
          {type: 'number', role: 'annotation'},
          'Decessi',
          {type: 'number', role: 'annotation'},
          'Ricoveri',
          {type: 'number', role: 'annotation'}, ]);
        dt.forEach((value) => {
          const date = this.datepipe.transform(value.data, 'dd MMM');
          dataTable.push([date,
            value.incidenza_7d, value.incidenza_7d,
            value.variazione_terapia_intensiva_7dma,
            value.variazione_terapia_intensiva_7dma,
            value.variazione_deceduti_7dma,
            value.variazione_deceduti_7dma,
            value.variazione_ricoverati_con_sintomi_7dma,
            value.variazione_ricoverati_con_sintomi_7dma]);
        });
        view = {columns: this.selectViewAnnotationInColumns(dataTable[0], this.charts.length)};
        this.charts.push({
          title: 'Andamento a 7 giorni',
          chart: {
            chartType: 'AreaChart',
            dataTable,
            formatters,
            options,
            view
          }
        });

        dataTable = [];
        dataTable.push([
          ['domain', 'Data'],
          'Terapia intensiva',
          {type: 'number', role: 'annotation'},
          'Ingressi T.I.',
          {type: 'number', role: 'annotation'},
          'Ricoveri',
          {type: 'number', role: 'annotation'},
          'Decessi',
          {type: 'number', role: 'annotation'}, ]);
        dt.forEach((value) => {
          const date = this.datepipe.transform(value.data, 'dd, MMM');
          console.log(value.ingressi_terapia_intensiva);
          dataTable.push([date,
            value.variazione_terapia_intensiva,
            value.variazione_terapia_intensiva,
            value.ingressi_terapia_intensiva,
            value.ingressi_terapia_intensiva,
            value.variazione_ricoverati_con_sintomi,
            value.variazione_ricoverati_con_sintomi,
            value.variazione_deceduti,
            value.variazione_deceduti]);
        });
        view = {columns: this.selectViewAnnotationInColumns(dataTable[0], this.charts.length)};
        this.charts.push({
          title: 'Carichi ospedalieri',
          chart: {
            chartType: 'AreaChart',
            dataTable,
            formatters,
            options,
            view
          }
        });

        // Grafico 7g su 7g
        dataTable = [];
        dataTable.push([
          ['domain', 'Data'],
          'Nuovi positivi',
          {type: 'number', role: 'annotation'},
          'Terapia intensiva',
          {type: 'number', role: 'annotation'},
          'Decessi',
          {type: 'number', role: 'annotation'},
          'Ricoveri',
          {type: 'number', role: 'annotation'},
          'Guariti',
          {type: 'number', role: 'annotation'},]);
        dt.forEach((value) => {
          const date = this.datepipe.transform(value.data, 'dd MMM');
          dataTable.push([date,
            value.nuovi_positivi_7d_incr,
            value.nuovi_positivi_7d_incr,
            value.terapia_intensiva_7d_incr,
            value.terapia_intensiva_7d_incr,
            value.deceduti_7d_incr,
            value.deceduti_7d_incr,
            value.ricoverati_con_sintomi_7d_incr,
            value.ricoverati_con_sintomi_7d_incr,
            value.dimessi_guariti_7d_incr,
            value.dimessi_guariti_7d_incr]);
        });
        view = {columns: this.selectViewAnnotationInColumns(dataTable[0], this.charts.length)};
        this.charts.push({
          title: '7 giorni su 7 giorni precedenti',
          chart: {
            chartType: 'AreaChart',
            dataTable,
            formatters,
            options,
            view
          }
        });

        // Grafico Percentuali
        dataTable = [];
        dataTable.push([
          ['domain', 'Data'],
          'Positivi/Casi',
          {type: 'string', role: 'annotation'},
          {type: 'string', role: 'tooltip'},
          'Positivi/Casi - 7g',
          {type: 'string', role: 'annotation'},
          {type: 'string', role: 'tooltip'},
          'Decessi',
          {type: 'string', role: 'annotation'},
          {type: 'string', role: 'tooltip'},
          'Case Fatality Rate',
          {type: 'string', role: 'annotation'},
          {type: 'string', role: 'tooltip'}, ]);

        const option2 = Object.create(options);
        option2.vAxis = {
            format: '#.##%'
        };
        dt.forEach((value) => {
          const date = this.datepipe.transform(value.data, 'dd MMM');
          dataTable.push([
              date,
            value.percentuale_positivi_casi_giornaliera,
            this.percentage.transform(value.percentuale_positivi_casi_giornaliera, '1.0-2'),
            this.percentageForTooltip(date, value.percentuale_positivi_casi_giornaliera, 'Positivi/Casi'),
            value.percentuale_positivi_casi_7dma,
            this.percentage.transform(value.percentuale_positivi_casi_7dma, '1.0-2'),
            this.percentageForTooltip(date, value.percentuale_positivi_casi_7dma, 'Positivi/Casi - 7g'),
            value.percentuale_variazione_deceduti,
            this.percentage.transform(value.percentuale_variazione_deceduti, '1.0-2'),
            this.percentageForTooltip(date, value.percentuale_variazione_deceduti, 'Decessi'),
            value.cfr,
            this.percentage.transform(value.cfr, '1.0-2'),
            this.percentageForTooltip(date, value.cfr, 'Case Fatality Rate')
          ]);
        });
        view = {columns: this.selectViewAnnotationInColumns(dataTable[0], this.charts.length)};
        this.charts.push({
          title: 'Percentuali',
          chart: {
            chartType: 'AreaChart',
            dataTable,
            formatters,
            options: option2,
            view
          }
        });
      }
    });
  }

  percentageForTooltip(date: string, value: number, columnnName: string): string{
    const result = `${date}\n${columnnName}: ${this.percentage.transform(value, '1.0-2')}`;
    return result;
  }

  ngOnInit() {
    this.showAnnotation = JSON.parse(localStorage.getItem('showAnnotationView_' + this.viewId) ) || [];
    this.loadGroupAreaChart();
  }

  ngAfterViewInit(): void {
    localStorage.setItem('height_' + this.viewId, JSON.stringify(this.height));
  }

}
