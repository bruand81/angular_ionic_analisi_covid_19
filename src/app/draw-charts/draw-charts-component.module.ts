import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {ExploreContainerComponent} from '../explore-container/explore-container.component';
import {DrawChartsComponent} from './draw-charts.component';

@NgModule({
    imports: [ CommonModule, FormsModule, IonicModule],
    declarations: [DrawChartsComponent],
    exports: [DrawChartsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DrawChartsComponentModule {
}
