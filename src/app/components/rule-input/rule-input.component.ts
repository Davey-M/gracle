import { Component, OnInit } from '@angular/core';
import { map, switchMap, tap } from 'rxjs';
import { iGracle, iRule } from 'src/app/models/gracle';
import { RULES_VERSION, RulesService } from 'src/app/services/rules/rules.service';
import { StateService } from 'src/app/services/state/state.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-rule-input',
  templateUrl: './rule-input.component.html',
  styleUrls: ['./rule-input.component.css']
})
export class RuleInputComponent implements OnInit {

  private _currentState$ = this._stateService.selectedGracle$.asObservable();
  currentRules$ = this._currentState$.pipe(
    switchMap(state => this._getRulesFromState(state)),
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

  ngOnInit(): void {
    this._rulesService.getRules();
  }

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

  private _getRulesFromState(state: iGracle): Promise<iRule[]> {
    if (state.results.length === 0) {
      return this._rulesService.getRulesVersion(RULES_VERSION);
    } else {
      const version = state.results[0].version;
      return this._rulesService.getRulesVersion(version);
    }
  }

}
