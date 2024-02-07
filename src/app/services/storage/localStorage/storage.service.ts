import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { iGracle } from 'src/app/models/gracle';
import { iStarRule } from 'src/app/models/star-rule';
import { RULES_VERSION } from '../../rules/rules.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  LIST_NAME = 'gracle-list';
  store$: BehaviorSubject<iGracle[]> = new BehaviorSubject<iGracle[]>([]);

  today$ = this.store$.pipe(
    map(list => list[0]),
  );

  STAR_RULE_NAME = "gracle-star-rule";
  // star rule index will be -1 if there is no star index
  starRule$ = new BehaviorSubject<iStarRule | null>(null);

  db = window.indexedDB.open('gracle-db');

  constructor() { }

  getState() {
    let storeString = window.localStorage.getItem(this.LIST_NAME);

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

    this.retrieveStarRuleIndex();
  }

  getDateString(date: Date = new Date()): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  saveState() {
    // save store
    const storeString = JSON.stringify(this.store$.value);
    window.localStorage.setItem(this.LIST_NAME, storeString);

    // save star rule index
    const starRuleString = JSON.stringify(this.starRule$.value);
    window.localStorage.setItem(this.STAR_RULE_NAME, starRuleString);
  }

  retrieveStarRuleIndex() {
    const starRuleIndexString = window.localStorage.getItem(this.STAR_RULE_NAME);

    if (starRuleIndexString === null) {
      this.starRule$.next(null);
    } else {
      const starRule = JSON.parse(starRuleIndexString);
      this.starRule$.next(starRule);
    }
  }

  setStarRule(ruleIndex: number | null) {
    if (ruleIndex === null) {
      this.starRule$.next(null);
    } else {
      this.starRule$.next({
        index: ruleIndex,
        version: RULES_VERSION,
      });
    }

    this.saveState();
  }
}
