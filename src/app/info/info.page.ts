import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'info.page.html',
  styleUrls: ['info.page.scss']
})
export class Tab3Page {
  pageTitle = 'Informazioni';
  pcmUrl = 'https://github.com/pcm-dpc/COVID-19';

  constructor(private iab: InAppBrowser) {}

  openBrowser(url: string) {
    const browser = this.iab.create(url);
    browser.show();
  }

}
