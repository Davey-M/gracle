import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, from, map, skipWhile, switchMap } from 'rxjs';
import { Month, iMonthState } from 'src/app/models/date';
import { gracleState, iGracle } from 'src/app/models/gracle';
import { RulesService } from 'src/app/services/rules/rules.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-stat-details',
  templateUrl: './stat-details.component.html',
  styleUrls: ['./stat-details.component.css']
})
export class StatDetailsComponent implements OnInit {

  ruleVersion$ = this._activeRoute.paramMap.pipe(
    map(map => map.get('version') || 'V1'),
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

  months$ = combineLatest([
    this._storageService.store$,
    this.ruleVersion$,
    this.ruleIndex$,
  ]).pipe(
    map(([ store, version, index ]) => this._buildMonths(store, version, index)),
  );

  constructor(private _activeRoute: ActivatedRoute,
              private _ruleService: RulesService,
              private _storageService: StorageService) { }

  ngOnInit(): void { }

  private _getMonthLength(month: Month, year: number | null = null): number {
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

  private _getMonthName(month: Month): string {
    switch (month) {
      case Month.Jan:
        return "January";
      case Month.Feb:
        return "February";
      case Month.Mar:
        return "March";
      case Month.Apr:
        return "April";
      case Month.May:
        return "May";
      case Month.Jun:
        return "June";
      case Month.Jul:
        return "July";
      case Month.Aug:
        return "August";
      case Month.Sep:
        return "September";
      case Month.Oct:
        return "October";
      case Month.Nov:
        return "November";
      case Month.Dec:
        return "December";
    }
  }

  private _buildMonths(store: iGracle[],
                       version: string,
                       ruleIndex: number): iMonthState[] {

    const monthMap = new Map<string, iMonthState>();

    // build all months
    for (let gracle of store) {
      const [ year, month ] = gracle.date.split('-').map(Number);
      let key = `${year}-${month}`;

      if (monthMap.has(key)) continue;
      
      const startDate = new Date(year, month, 1);

      const monthToStore = {
        year: year,
        month: month,
        name: this._getMonthName(month),
        numOfDays: this._getMonthLength(month),
        startIndex: 0,
        state: new Array(this._getMonthLength(month)).fill(gracleState.empty),
      };

      // this will place the blanking space at the right position to start the month
      // on the correct day
      monthToStore.startIndex = 7 - ((monthToStore.numOfDays + startDate.getDay()) % 7);

      monthMap.set(key, monthToStore);
    }

    // fill the month state
    for (let gracle of store) {
      const [ year, month, day ] = gracle.date.split('-').map(Number);
      const key = `${year}-${month}`;
      
      const monthData = monthMap.get(key);

      const tile = gracle.results.find(r => r.version === version && r.ruleIndex === ruleIndex);

      if (!tile || !monthData) continue;

      monthData.state[day - 1] = tile.state;
      monthMap.set(key, monthData);
    }

    // build the month output
    const output: iMonthState[] = [];

    for (let month of monthMap.values()) {
      month.state.reverse();
      output.push(month);
    }

    return output
      .sort((a, b) => b.month - a.month)
      .sort((a, b) => b.year - a.year);
  }
}
