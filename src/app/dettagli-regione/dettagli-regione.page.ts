import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ListRegioni} from '../models/list-regioni';
import {ApiService} from '../service/api.service';
import {Province} from '../models/province';
import {DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {ChartData} from '../models/chart-data';
import { Chart } from 'chart.js';
import * as d3 from 'd3';

@Component({
  selector: 'app-dettagli-regione',
  templateUrl: './dettagli-regione.page.html',
  styleUrls: ['./dettagli-regione.page.scss'],
})
export class DettagliRegionePage implements OnInit, AfterViewInit {
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  @ViewChild('lineCanvas2') private lineCanvas2: ElementRef;
  pageTitle = 'Dettagli regione';
  listRegioni: ListRegioni[];
  selectedRegion = 15;
  province: Province[];
  latestProvince: Province[];
  public showContent = false;
  public openIcon = 'chevron-down-outline';
  public cardContentStyle = 'display: none';
  chartData: ChartData[] = [];
  codiciProvince: number[];
  dataset = [];
  chartLabels = [];
  colorScale = d3.schemePaired;
  lineChart: any;

  constructor(
      public api: ApiService,
      public datepipe: DatePipe,
      private decimalPipe: DecimalPipe,
      private percentPipe: PercentPipe
  ) { }

  ngAfterViewInit(): void {
      this.getListProvinceInRegione(this.selectedRegion);
  }

  getListRegioni(){
    this.api.getListRegioni().subscribe((data) => {
      this.listRegioni = data;
    });
  }

  getListProvinceInRegione(value: number) {
    this.api.getProvinceInRegione(value).subscribe((data) => {
      this.province = data.results;
      const maxdate = data.results[0].data;
      this.latestProvince = data.results.filter((provincia) => {
        return provincia.data === maxdate;
      });
      this.codiciProvince = this.latestProvince.filter(
          (thing, i, arr) => arr.findIndex(t => t.codice_provincia === thing.codice_provincia) === i
      ). map<number>((item) => item.codice_provincia);
      this.drawGraph('variazione_totale_casi', this.lineCanvas);
      this.drawGraph('incidenza_7d', this.lineCanvas2);
    });
  }

  selectedRegionFn() {
    this.getListProvinceInRegione(this.selectedRegion);
  }

  compareFn(e1: number, e2: number): boolean {
    return e1 && e2 ? e1 === e2 : e1 === e2;
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

  drawGraph(field: string, lineCanvasDest: ElementRef){
    if (this.codiciProvince) {
      this.dataset = [];
      let i = 0;
      for (const codice of this.codiciProvince) {
        this.drawLine(codice, i, field);
        i++;
      }
      this.lineChart = new Chart(lineCanvasDest.nativeElement, {
        type: 'line',
        data: {
          labels: this.chartLabels,
          datasets: this.dataset
        }
      });
    }
  }

  drawLine(codiceProvincia: number, index: number, field: string){
    const chartData: number[] = [];
    this.chartLabels = [];
    let lineTitle = '';
    this.province.filter((provincia) => {
      return provincia.codice_provincia === codiceProvincia;
    }).reverse().forEach((provincia) => {
      chartData.push(provincia[field]);
      this.chartLabels.push(this.datepipe.transform(provincia.data, 'dd/MM'));
      lineTitle = provincia.denominazione_provincia;
    });
    this.dataset.push({
      label: lineTitle,
      fill: true,
      borderColor: this.colorScale[index % this.colorScale.length],
      backgroundColor: this.colorScale[index % this.colorScale.length] + '33',
      lineTension: 0.2,
      data: chartData,
      spanGaps: true,
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

  ngOnInit() {
    this.getListRegioni();
  }

}