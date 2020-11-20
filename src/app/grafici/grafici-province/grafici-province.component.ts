import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChartsInterface} from '../charts-interface';
import {DatePipe, PercentPipe} from '@angular/common';
import {Platform} from '@ionic/angular';
import {Province} from '../../models/province';

@Component({
  selector: 'app-grafici-province',
  templateUrl: '../grafici.component.html',
  styleUrls: ['../grafici.component.scss'],
})
export class GraficiProvinceComponent implements OnInit, AfterViewInit{
  @Input() data: Province[];
  @Input() height: number;
  @Input() viewId: number;
  @Input() codiciProvince: number[];
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
    if (this.data) {
      this.charts = [];
      this.charts.push(this.buildChart('variazione_totale_casi', 'Casi province'));
      this.charts.push(this.buildChart('incidenza_7d', 'Incidenza province'));
      // console.log(this.data);
    }
  }

  buildChart(field: string, chartTitle: string): ChartsInterface {
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
      // width: '100%',
      chartArea: {
        height: '70%',
        width: '80%'
      },
      hAxis: {
        slantedText: true,
        slantedTextAngle: 20,
      },

    };

    const uniqueDates = this.getUniqueData().reverse();
    const annotation = {type: 'string', role: 'annotation'};
    const tooltip = {type: 'string', role: 'tooltip'};
    const dataTable = [];
    let row: any[] = [['domain', 'Data']];
    const customTooltip = false;
    this.codiciProvince.forEach(value => {
      const title = this.data.filter((provincia) => {
        return provincia.codice_provincia === value;
      })[0].denominazione_provincia;
      row.push(title);
      row.push(annotation);
      if (customTooltip) { row.push(tooltip); }
    });
    // console.log(row);
    dataTable.push(row);
    uniqueDates.forEach(d => {
      row = [this.datepipe.transform(d, 'dd MMM')];
      this.codiciProvince.forEach(c => {
        const v = this.data.filter((provincia) => {
          return provincia.data === d && provincia.codice_provincia === c;
        })[0];
        // console.log(v.denominazione_provincia);
        row.push(v[field]); // scope
        row.push(v[field]); // annotation
        if (customTooltip) { row.push(v[field]); } // tooltip
      });
      // console.log(row);
      dataTable.push(row);
    });
    const view = {columns: this.selectViewAnnotationInColumns(dataTable[0], this.charts.length)};
    const chart = {
      title: chartTitle,
      chart: {
        chartType: 'AreaChart',
        dataTable,
        formatters,
        options,
        view
      }
    };
    return chart;
  }

  getUniqueData(): Date[]{
    const distinct: Date[] = [];
    for (const provincia of this.data){
      if (!distinct.includes(provincia.data)) {
        distinct.push(provincia.data);
      }
    }
    return distinct;
  }

  percentageForTooltip(date: string, value: number, columnnName: string): string{
    const result = `${date}\n${columnnName}: ${this.percentage.transform(value)}`;
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
