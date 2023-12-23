import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, switchMap, zip } from 'rxjs';
import { iRule } from 'src/app/models/gracle';

// version will always be in format "v{version number}"
export const RULES_VERSION = "v2";

@Injectable({
  providedIn: 'root'
})
export class RulesService {

  rules$ = new BehaviorSubject<iRule[]>([]);

  private _versionedRules = new Map<string, iRule[]>();

  private _trigger$ = new BehaviorSubject<null>(null);
  private _versionsIndex$ = this._trigger$.pipe(
    switchMap(() => this._http.get<string[]>('/assets/rules/versions-index.json')),
  );

  rulesMap$ = this._versionsIndex$.pipe(
    switchMap(versions =>
      zip(versions.map((v) => this._http.get<iRule[]>(`/assets/rules/${v}.json`))).pipe(
        map(rules => this._getRuleMap(versions, rules)),
      ),
    ),
  );

  currentRules$ = this.rulesMap$.pipe(
    map(rules => rules.get(RULES_VERSION)),
  );

  constructor(private _http: HttpClient) { }

  getRules() {
    const subscription = this._http.get<iRule[]>(`/assets/rules/${RULES_VERSION}.json`)
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
        const subscription = this._http.get<iRule[]>(`/assets/rules/${version}.json`)
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

  private _getRuleMap(versions: string[], rules: iRule[][]): Map<string, iRule[]> {
    const outputMap = new Map<string, iRule[]>();
    for (let i = 0; i < versions.length; i++) {
      outputMap.set(versions[i], rules[i]);
    }
    return outputMap;
  }
}
