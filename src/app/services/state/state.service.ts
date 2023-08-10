import { Injectable } from '@angular/core';
import { combineLatest, map, skipWhile } from 'rxjs';
import { RulesService } from '../rules/rules.service';
import { StorageService } from '../storage/storage.service';
import { gracleState, iGracle, iGracleTile, iRule } from 'src/app/models/gracle';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  tileState$ = combineLatest([
    this._rulesService.rules$,
    this._storageService.today$,
  ]).pipe(
    skipWhile(([rules, today]) => !rules || !today),
    map(([rules, today]) => this._formatTileState(rules, today))
  );

  constructor(
    private _rulesService: RulesService,
    private _storageService: StorageService,
  ) { }

  private _formatTileState(rules: iRule[], today: iGracle): iGracleTile[] {
    if (today.results.length === 0) {
      return rules
        .filter(rule => rule.deprecated === false)
        .map(rule => {
          return {
            ruleIndex: rule.index,
            state: gracleState.inProgress,
          }
        });
    }
    else {
      return today.results;
    }
  }
}
