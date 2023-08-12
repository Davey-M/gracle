import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { RulesService } from 'src/app/services/rules/rules.service';
import { StateService } from 'src/app/services/state/state.service';

@Component({
  selector: 'app-rule-input',
  templateUrl: './rule-input.component.html',
  styleUrls: ['./rule-input.component.css']
})
export class RuleInputComponent implements OnInit {

  currentRules$ = this._rulesService.rules$.pipe(
    map(rules => rules.filter(rule => rule.deprecated === false)),
  );

  constructor(
    private _rulesService: RulesService,
    private _stateService: StateService,
  ) { }

  ngOnInit(): void {
    this._rulesService.getRules();
  }

  updateTile(index: number) {
    this._stateService.updateTile(index);
  }

}
