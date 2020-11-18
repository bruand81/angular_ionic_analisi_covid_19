import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ChartData} from '../models/chart-data';
import { v4 as uuidv4 } from 'uuid';
import {Riepilogoregioni} from '../models/riepilogoregioni';
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
      let prevMax: number;
      const idA = 'highValue';
      const idB = 'lowValue';
      let usedTwoAxis = false;
      this.data.chartLines.forEach((line) => {
        const chartjsData: number[] = [];
        let axisId = idA;
        data.forEach(item => {
          chartjsData.push(item[line.field]);
        });
        const maxValue = Math.log(Math.max.apply(null, chartjsData));
        if (!prevMax) {
          prevMax = maxValue;
        }
        const distance = maxValue - prevMax;
        if (Math.abs(distance) >= 4) {
          usedTwoAxis = true;
          axisId = (axisId === idA) ? idB : idA;
        }

        // console.log(line.title + ' - ' + distance);
        // console.log(chartjsData);

        datasets.push({
          label: line.title,
          yAxisID: axisId,
          fill: true,
          borderColor: colorScale[i % colorScale.length],
          backgroundColor: colorScale[i % colorScale.length] + '33',
          lineTension: 0.4,
          data: chartjsData,
          spanGaps: true,
        });
        i++;
      });

      let plugins = {};
      let ticks = {};
      let tooltips = {};
      if (this.data.type === 'percentage') {
        plugins = {
          datalabels: {
            formatter: (value, ctx) => {
              return (value * 100).toFixed(2) + '%';
            }
          }
        };

        ticks = {
          callback: (value, index, values ) => {
            return (value * 100).toFixed(0) + '%';
          }
        };

        tooltips = {
          callbacks: {
            label: (tooltipItem, tooltipData) => {
              // get the concerned dataset
              const dataset = tooltipData.datasets[tooltipItem.datasetIndex];
              let label = dataset.label || '';

              if (label) {
                label += ': ';
              }
              // get the current items value
              const currentValue = dataset.data[tooltipItem.index];
              // calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
              const percentage = (currentValue * 100);

              return label + percentage.toFixed(2) + '%';
            }
          }
        };
      }

      const yAxes = [{
        id: idA,
        type: 'linear',
        position: 'left',
        ticks
      }];
      if (usedTwoAxis) {
        yAxes.push({
          id: idB,
          type: 'linear',
          position: 'right',
          ticks
        });
      }

      const chart = {
        type: 'line',
        data: {
          labels: chartjsLabels,
          datasets,
        },
        options: {
          scales: {
            yAxes
          },
          plugins,
          tooltips
        }
      };

      // console.log(chart);
      this.lineChart = new Chart(this.lineCanvas.nativeElement, chart);
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
