import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, Subject, switchMap, takeUntil, zip } from 'rxjs';
import { iRule } from 'src/app/models/gracle';

// version will always be in format "v{version number}"
export const RULES_VERSION = "v2";

@Injectable({
  providedIn: 'root'
})
export class RulesService implements OnDestroy {

  private _unsubscribe$ = new Subject<void>();

  private _versionsIndex$ = this._http.get<string[]>('/assets/rules/versions-index.json');

  private _formattedRules$ = this._versionsIndex$.pipe(
    switchMap(versions =>
      zip(versions.map((v) => this._http.get<iRule[]>(`/assets/rules/${v}.json`))).pipe(
        map(rules => this._getRuleMap(versions, rules)),
      )
    ),
  );

  private _rulesMap$ = new BehaviorSubject(new Map<string, iRule[]>());

  currentRules$ = this._rulesMap$.pipe(
    filter(rules => rules?.has(RULES_VERSION)),
    map(rules => rules.get(RULES_VERSION) as iRule[]),
  );

  constructor(private _http: HttpClient) {
    // populate the rules map
    this._formattedRules$.pipe(
      takeUntil(this._unsubscribe$),
    ).subscribe(rules => this._rulesMap$.next(rules));
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
  }

  getRules(version: string): Observable<iRule[]> {
    return this._rulesMap$.pipe(
      filter(rules => rules?.has(version)),
      map(rules => rules.get(version) as iRule[]),
    );
  }

  private _getRuleMap(versions: string[], rules: iRule[][]): Map<string, iRule[]> {
    const outputMap = new Map<string, iRule[]>();
    for (let i = 0; i < versions.length; i++) {
      outputMap.set(versions[i], rules[i]);
    }
    return outputMap;
  }
}
