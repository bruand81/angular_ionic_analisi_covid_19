import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'riepilogo',
        loadChildren: () => import('../regioni/regioni.module').then(m => m.RegioniPageModule)
      },
      {
        path: 'regione',
        loadChildren: () => import('../province/province.module').then(m => m.ProvincePageModule)
      },
      {
        path: 'province',
        loadChildren: () => import('../dettagli-regione/dettagli-regione.module').then(m => m.DettagliRegionePageModule)
      },
      {
        path: 'info',
        loadChildren: () => import('../info/info.module').then(m => m.InfoPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/riepilogo',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/riepilogo',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
