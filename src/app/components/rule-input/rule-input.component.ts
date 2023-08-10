import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { gracleState, iGracleTile, iRule } from 'src/app/models/gracle';
import { RulesService } from 'src/app/services/rules/rules.service';

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
    private _rulesService: RulesService
  ) { }

  ngOnInit(): void {
    this._rulesService.getRules();
  }

}
