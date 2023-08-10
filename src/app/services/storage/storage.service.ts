import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { iGracle } from 'src/app/models/gracle';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  store$: BehaviorSubject<iGracle[]> = new BehaviorSubject<iGracle[]>([]);

  today$ = this.store$.pipe(
    map(list => list[0]),
  );

  constructor() { }

  getState() {
    let storeString = window.localStorage.getItem('gracle-list');
    if (storeString) {
      const store: iGracle[] = JSON.parse(storeString);

      // add today to the store if it doesn't exist already
      const todaysDate = new Date();
      const todayString = `${todaysDate.getFullYear()}-${todaysDate.getMonth()}-${todaysDate.getDay()}`;
      if (store[0] === null || store[0]?.date !== todayString) {
        store.unshift({
          date: todayString,
          results: [],
        });
      }

      this.store$.next(store);
    }
    else {
      const store: iGracle[] = [];

      // add today to the store if it doesn't exist already
      const todaysDate = new Date();
      const todayString = `${todaysDate.getFullYear()}-${todaysDate.getMonth()}-${todaysDate.getDay()}`;
      if (store[0] === null || store[0]?.date !== todayString) {
        store.unshift({
          date: todayString,
          results: [],
        });
      }

      this.store$.next(store);
    }
  }

  saveState() {
    let storeString = JSON.stringify(this.store$);
    window.localStorage.setItem('gracle-list', storeString);
  }
}
