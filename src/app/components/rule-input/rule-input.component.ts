import { Component } from '@angular/core';
import { map, Observable, switchMap, tap } from 'rxjs';
import { iGracle, iRule } from 'src/app/models/gracle';
import { RULES_VERSION, RulesService } from 'src/app/services/rules/rules.service';
import { StateService } from 'src/app/services/state/state.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-rule-input',
  templateUrl: './rule-input.component.html',
  styleUrls: ['./rule-input.component.css']
})
export class RuleInputComponent {

  private _currentState$ = this._stateService.selectedGracle$.asObservable();
  currentRules$ = this._currentState$.pipe(
    switchMap(state => this._getRulesFromState(state)),
  );

  showStarRule$ = this._currentState$.pipe(
    map(state => this._getStarRuleShown(state)),
  );

  private _starRuleIndex: number | null = null;
  starRuleIndex$ = this._storageService.starRule$.pipe(
    map(starRule => {
      if (starRule?.version === RULES_VERSION) {
        return starRule.index;
      } else {
        return null;
      }
    }),
    tap(index => this._starRuleIndex = index),
  );

  private _setStarRuleTimeout: NodeJS.Timeout | null = null;

  constructor(
    private _rulesService: RulesService,
    private _stateService: StateService,
    private _storageService: StorageService,
  ) { }

  updateTile(index: number) {
    this._stateService.updateTile(index);
  }

  handleRuleMouseDown(ruleIndex: number) {
    this._setStarRuleTimeout = setTimeout(() => {
      if (ruleIndex === this._starRuleIndex) {
        this._storageService.setStarRule(null);
      } else {
        this._storageService.setStarRule(ruleIndex);
      }

      this._setStarRuleTimeout = null;
    }, 500);
  }

  handleRuleMouseUp() {
    if (this._setStarRuleTimeout) {
      clearTimeout(this._setStarRuleTimeout);
    }
  }

  private _getRulesFromState(state: iGracle): Observable<iRule[]> {
    if (state.results.length === 0) {
      return this._rulesService.currentRules$;
    } else {
      const version = state.results[0].version;
      return this._rulesService.getRules(version);
    }
  }

  /**
    * The star rule will only be shown no the current version
    */
  private _getStarRuleShown(state: iGracle) {
    if (state.results.length === 0) return true;

    return state.results[0].version === RULES_VERSION;
  }

}
