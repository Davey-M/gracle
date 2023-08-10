import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { iRule } from 'src/app/models/gracle';

@Injectable({
  providedIn: 'root'
})
export class RulesService {

  rules$ = new BehaviorSubject<iRule[]>([]);

  constructor(private _http: HttpClient) { }

  getRules() {
    this._http.get<iRule[]>('/assets/rules.json').pipe(
      take(1),
    ).subscribe((rules) => {
      this.rules$.next(rules);
    });
  }
}
