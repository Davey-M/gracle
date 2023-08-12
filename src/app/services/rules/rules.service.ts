import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { iRule } from 'src/app/models/gracle';

@Injectable({
  providedIn: 'root'
})
export class RulesService {

  rules$ = new BehaviorSubject<iRule[]>([]);

  constructor(private _http: HttpClient) { }

  getRules() {
    const subscription = this._http.get<iRule[]>('/assets/rules.json').subscribe((rules) => {
      this.rules$.next(rules);
      subscription.unsubscribe();
    });
  }
}
