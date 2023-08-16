import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError } from 'rxjs';
import { iRule } from 'src/app/models/gracle';

export const RULES_VERSION = "1.0";

@Injectable({
  providedIn: 'root'
})
export class RulesService {

  rules$ = new BehaviorSubject<iRule[]>([]);

  private _versionedRules = new Map<string, iRule[]>();

  constructor(private _http: HttpClient) { }

  getRules() {
    const subscription = this._http.get<iRule[]>(`/assets/rules.${RULES_VERSION}.json`)
      .subscribe((rules) => {
        this.rules$.next(rules);
        this._versionedRules.set(RULES_VERSION, rules);
        subscription.unsubscribe();
      });
  }

  async getRulesVersion(version: string): Promise<iRule[]> {
    if (this._versionedRules.has(version)) {
      return this._versionedRules.get(version)!;
    } else {
      // this method returns a promise that resolves once the new assets are gathered
      return new Promise<iRule[]>((resolve, reject) => {

        // get the rules
        const subscription = this._http.get<iRule[]>(`/assets/rules.${version}.json`)
          .pipe(
            // handle errors
            catchError(error => {
              reject(error)
              throw `Error getting rules version ${version}`;
            }),
          )
          .subscribe(rules => {
            // store the version of rules once we get them
            this._versionedRules.set(version, rules);
            subscription.unsubscribe();
            resolve(rules);
          });
      });
    }
  }
}
