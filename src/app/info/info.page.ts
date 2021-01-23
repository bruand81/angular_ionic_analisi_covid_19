import {Component, OnInit} from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {PathNavigatorSupportService} from '../service/path-navigator-support.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'info.page.html',
  styleUrls: ['info.page.scss']
})
export class InfoPage implements OnInit{
  pageTitle = 'Informazioni';
  pcmUrl = 'https://github.com/pcm-dpc/COVID-19';
  viewId = 4;

  constructor(private iab: InAppBrowser,
              private router: Router,
              public pathNavigatorSupport: PathNavigatorSupportService) {}

  openBrowser(url: string) {
    const browser = this.iab.create(url);
    browser.show();
  }

  onSwipeLeft($event) {
    const path = this.pathNavigatorSupport.getPreviousPath(this.viewId);
    this.router.navigate([path]);
  }

  onSwipeRight($event) {
    const path = this.pathNavigatorSupport.getNextPath(this.viewId);
    this.router.navigate([path]);
  }

  ngOnInit(): void {
    // console.log(this.pathNavigatorSupport.getNextPath(this.viewId));
  }

}
