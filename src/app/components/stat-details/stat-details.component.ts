import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, from, map, of, skipWhile, switchMap } from 'rxjs';
import { Month, iMonthState } from 'src/app/models/date';
import { gracleState, iRule } from 'src/app/models/gracle';
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

  months$ = of(this._getFakeMonths());

  constructor(private _activeRoute: ActivatedRoute,
              private _ruleService: RulesService) { }

  ngOnInit(): void { }

  private _getMonthLength(month: Month, year: number | null = null) {
    switch (month) {
      case Month.Jan:
        return 31;
      case Month.Feb:
        if (year === null) throw 'Year must be provided for February';
        var leapYear = new Date(year, month, 29).getDate() === 29;
        return leapYear ? 29 : 28;
      case Month.Mar:
        return 31;
      case Month.Apr:
        return 30;
      case Month.May:
        return 31;
      case Month.Jun:
        return 30;
      case Month.Jul:
        return 31;
      case Month.Aug:
        return 31;
      case Month.Sep:
        return 30;
      case Month.Oct:
        return 31;
      case Month.Nov:
        return 30;
      case Month.Dec:
        return 31;
    }
  }

  private _getFakeMonths() {
    const output: iMonthState[] = [];

    const aprDate = new Date(2023, Month.Apr, 1);
    output.push({
      name: "April",
      month: Month.Apr,
      numOfDays: this._getMonthLength(Month.Apr),
      state: new Array(this._getMonthLength(Month.Apr))
        .fill(gracleState.empty)
        .map(_ => Math.floor(Math.random() * 4) as gracleState),
      startIndex: aprDate.getDay()
    });

    const febDate = new Date(2023, Month.Feb, 1);
    output.push({
      name: "February",
      month: Month.Feb,
      numOfDays: this._getMonthLength(Month.Feb, 2023),
      state: new Array(this._getMonthLength(Month.Feb, 2023))
        .fill(gracleState.empty)
        .map(_ => Math.floor(Math.random() * 4) as gracleState),
      startIndex: febDate.getDay()
    });

    return output;
  }
}
