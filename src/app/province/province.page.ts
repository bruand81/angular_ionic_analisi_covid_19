import {Component, OnInit} from '@angular/core';
import {ApiService} from '../service/api.service';
import {ListRegioni} from '../models/list-regioni';
import {BehaviorSubject} from 'rxjs';
import {Riepilogoregioni} from '../models/riepilogoregioni';
import * as d3 from 'd3';
import {ChartData} from '../models/chart-data';
import {Regioni} from '../models/regioni';
import {Router} from '@angular/router';
import {LoadingController, Platform} from '@ionic/angular';
import {PathNavigatorSupportService} from '../service/path-navigator-support.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'province.page.html',
  styleUrls: ['province.page.scss']
})
export class ProvincePage implements OnInit{
  listRegioni: ListRegioni[];
  selectedRegion = 15;
  riepilogoRegioni = new BehaviorSubject<Riepilogoregioni[]>(null);
  // chartData: ChartData[] = [];
  regioni: Regioni[];
  viewId = 2;
  graphHeight = 400;

  constructor(
      public api: ApiService,
      private router: Router,
      public pathNavigatorSupport: PathNavigatorSupportService,
      public platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.graphHeight = platform.width() * .50;
    });
  }

  getListRegioni(){
    this.api.getListRegioni().subscribe((data) => {
      this.listRegioni = data.results;
    });
  }

  getLatestRegioni(value: number) {
    this.api.getLatestRegioni(value).subscribe((resp: any) => {
      this.regioni = resp.results;
    });
  }

  getRiepilogoRegioni(value: number) {
    this.api.getRiepilogoRegioni(value).subscribe((resp: any) => {
      this.riepilogoRegioni.next(resp.results);
    });
  }

  selectedRegionFn() {
    localStorage.setItem('selectedRegion', JSON.stringify(this.selectedRegion));
    this.getLatestRegioni(this.selectedRegion);
    this.getRiepilogoRegioni(this.selectedRegion);
  }

  compareFn(e1: number, e2: number): boolean {
    return e1 && e2 ? e1 === e2 : e1 === e2;
  }

  onSwipeLeft($event) {
    const path = this.pathNavigatorSupport.getPreviousPath(this.viewId);
    this.router.navigate([path]);
  }

  onSwipeRight($event) {
    const path = this.pathNavigatorSupport.getNextPath(this.viewId);
    this.router.navigate([path]);
  }

  refresh(){}

  ngOnInit(): void {
    this.selectedRegion = JSON.parse(localStorage.getItem('selectedRegion') ) || 1;
    this.getListRegioni();
    this.getLatestRegioni(this.selectedRegion);
    this.getRiepilogoRegioni(this.selectedRegion);
  }

}
