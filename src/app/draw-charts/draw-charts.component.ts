import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ChartData} from '../models/chart-data';
import { v4 as uuidv4 } from 'uuid';
import {Riepilogoregioni} from '../models/riepilogoregioni';
import * as d3 from 'd3';
import {DatePipe} from '@angular/common';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-draw-charts',
  templateUrl: './draw-charts.component.html',
  styleUrls: ['./draw-charts.component.scss'],
})
export class DrawChartsComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  @Input() data: ChartData;

  public chartId = '#' + uuidv4();
  public title = 'Caricamento dati';
  lineChart: any;
  showContent = true;
  public openIcon = 'chevron-up-outline';
  public cardContentStyle = 'display: block';

  constructor(
      public datepipe: DatePipe
  ) { }

  ngAfterViewInit(): void {
        if (this.data) {
          this.title = this.data.title;
          this.lineChartMethod(this.data.data);
        }
    }

  lineChartMethod(data: Riepilogoregioni[]) {
    if (data && this.lineCanvas) {
      const colorScale = this.data.colorScheme;
      const chartjsLabels = [];
      data.forEach(item => {
        chartjsLabels.push(this.datepipe.transform(item.data, 'dd/MM'));
      });
      const datasets = [];
      let i = 0;
      this.data.chartLines.forEach((line) => {
        const chartjsData = [];
        data.forEach(item => {
          chartjsData.push(item[line.field]);
        });
        datasets.push({
          label: line.title,
          fill: true,
          borderColor: colorScale[i % colorScale.length],
          backgroundColor: colorScale[i % colorScale.length] + '33',
          lineTension: 0.2,
          data: chartjsData,
          spanGaps: true,
        });
        i++;
      });

      console.log(this.lineCanvas);
      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: chartjsLabels,
          datasets
        }
      });
    }
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

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data) {
      this.title = this.data.title;
      this.lineChartMethod(this.data.data);
    }
  }

}
