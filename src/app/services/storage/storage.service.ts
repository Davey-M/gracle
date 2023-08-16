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

    let store: iGracle[];
    if (storeString) {
      store = JSON.parse(storeString);
    }
    else {
      store = [];
    }

    // add today to the store if it doesn't exist already
    const todayString = this.getDateString();
    if (store[0] === null || store[0]?.date !== todayString) {
      store.unshift({
        date: todayString,
        results: [],
      });
    }

    this.store$.next(store);

    console.log(this.store$.value);
  }

  getDateString(): string {
    const todaysDate = new Date();
    return `${todaysDate.getFullYear()}-${todaysDate.getMonth()}-${todaysDate.getDate()}`;
  }

  saveState() {
    let storeString = JSON.stringify(this.store$.value);
    window.localStorage.setItem('gracle-list', storeString);
  }
}
