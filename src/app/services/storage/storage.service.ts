import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { gracleState, iGracle, iGracleTile } from 'src/app/models/gracle';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  store$: BehaviorSubject<iGracle[]> = new BehaviorSubject<iGracle[]>([]);

  private _today: iGracle | null = null;
  today$ = this.store$.pipe(
    map(list => list[0]),
    tap(today => this._today = today),
  );

  constructor() { }

  getState() {
    let storeString = window.localStorage.getItem('gracle-list');
    if (storeString) {
      const store: iGracle[] = JSON.parse(storeString);

      // add today to the store if it doesn't exist already
      const todayString = this.getDateString();
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
      const todayString = this.getDateString();
      if (store[0] === null || store[0]?.date !== todayString) {
        store.unshift({
          date: todayString,
          results: [],
        });
      }

      this.store$.next(store);
    }
  }

  getDateString(): string {
    const todaysDate = new Date();
    return `${todaysDate.getFullYear()}-${todaysDate.getMonth()}-${todaysDate.getDay()}`;
  }

  saveState() {
    let storeString = JSON.stringify(this.store$.value);
    window.localStorage.setItem('gracle-list', storeString);
  }
}
