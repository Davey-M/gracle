import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { iGracle } from 'src/app/models/gracle';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  store$: BehaviorSubject<iGracle[]> = new BehaviorSubject<iGracle[]>([]);

  constructor() { }

  getState() {
    let storeString = window.localStorage.getItem('gracle-list');
    if (storeString) {
      let store = JSON.parse(storeString);
      this.store$.next(store);
    }
  }

  saveState() {
    let storeString = JSON.stringify(this.store$);
    window.localStorage.setItem('gracle-list', storeString);
  }
}
