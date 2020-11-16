import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PathNavigatorSupportService {
  paths = {
    0: '/tabs/riepilogo',
    1: '/tabs/riepilogo',
    2: '/tabs/regione',
    3: '/tabs/province',
    4: '/tabs/info'
  };

  constructor() { }

  public getNextPath(currentId: number): string {
    const maxNumPath = Object.keys(this.paths).length - 1;
    const id = currentId + 1;
    return (this.paths)[(id > maxNumPath - 1) ? maxNumPath : id];
  }

  public getPreviousPath(currentId: number): string {
    const id = currentId - 1;
    return (this.paths)[(id < 0) ? 0 : id];
  }
}
