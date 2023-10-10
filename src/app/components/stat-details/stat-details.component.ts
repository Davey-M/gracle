import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, from, map, skipWhile, switchMap } from 'rxjs';
import { iRule } from 'src/app/models/gracle';
import { RulesService } from 'src/app/services/rules/rules.service';

@Component({
  selector: 'app-stat-details',
  templateUrl: './stat-details.component.html',
  styleUrls: ['./stat-details.component.css']
})
export class StatDetailsComponent implements OnInit {

  ruleVersion$ = this._activeRoute.paramMap.pipe(
    map(map => map.get('version')),
  );

  ruleIndex$ = this._activeRoute.paramMap.pipe(
    map(map => Number(map.get('rule-index'))),
  );

  rule$ = this.ruleVersion$.pipe(
    skipWhile(v => !v),
    switchMap(v => combineLatest([
      from(this._ruleService.getRulesVersion(v!)),
      this.ruleIndex$,
    ]).pipe(
      map(([ rules, index ]) => rules[index] || null)
    ))
  );

  constructor(private _activeRoute: ActivatedRoute,
              private _ruleService: RulesService) { }

  ngOnInit(): void { }
}
