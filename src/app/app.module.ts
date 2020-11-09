import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {HttpClientModule} from '@angular/common/http';
import {DatePipe, DecimalPipe, PercentPipe, registerLocaleData, TitleCasePipe} from '@angular/common';
import localeIt from '@angular/common/locales/it';

registerLocaleData(localeIt, 'it');

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {provide: LOCALE_ID, useValue: 'it'},
    InAppBrowser,
    DatePipe,
    DecimalPipe,
    PercentPipe,
    TitleCasePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
