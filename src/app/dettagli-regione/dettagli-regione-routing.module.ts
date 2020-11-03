import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DettagliRegionePage } from './dettagli-regione.page';

const routes: Routes = [
  {
    path: '',
    component: DettagliRegionePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DettagliRegionePageRoutingModule {}
