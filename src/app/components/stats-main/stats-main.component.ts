import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { gracleState, iGracle, iGracleTile } from 'src/app/models/gracle';
import { iRuleStat } from 'src/app/models/stats';
import { RulesService } from 'src/app/services/rules/rules.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-stats-main',
  templateUrl: './stats-main.component.html',
  styleUrls: ['./stats-main.component.css']
})
export class StatsMainComponent implements OnInit {

  stats$ = this._storageService.store$.pipe(
    map(store => this._groupByRuleAndVersion(store)),
  );

  constructor(private _storageService: StorageService) { }

  ngOnInit(): void {
  }

  private _groupByRuleAndVersion(store: iGracle[]): iRuleStat[] {

    // the key for the map is a string of `${version}-${ruleIndex}`
    const ruleStatMap = new Map<string, iRuleStat>();

    // format all of the stats except for the percentage
    for (let item of store) {
      for (let tile of item.results) {
        const id = `${tile.version}-${tile.ruleIndex}`;

        if (ruleStatMap.has(id)) {
          const current = ruleStatMap.get(id)!;

          ruleStatMap.set(id, {
            ...current,
            tiles: [ ...current.tiles, tile ],
          });
        } else {
          ruleStatMap.set(id, {
            ruleVersion: tile.version,
            ruleIndex: tile.ruleIndex,
            tiles: [ tile ],

            // these will be added later
            percentages: {
              missed: 0,
              attempted: 0,
              succeeded: 0,
            },
            totals: {
              missed: 0,
              attempted: 0,
              succeeded: 0,
            }
          })
        }
      }
    }

    const outputStats: iRuleStat[] = [];

    for (let ruleStat of ruleStatMap.values()) {
      const total = ruleStat.tiles.length;

      for (let tile of ruleStat.tiles) {
        switch (tile.state) {
          case gracleState.inProgress:
            ruleStat.totals.missed++;
            break;
          case gracleState.attempted:
            ruleStat.totals.attempted++;
            break;
          case gracleState.succeeded:
            ruleStat.totals.succeeded++;
            break;
        }
      }

      ruleStat.percentages.missed = ruleStat.totals.missed / total;
      ruleStat.percentages.attempted = ruleStat.totals.attempted / total;
      ruleStat.percentages.succeeded = ruleStat.totals.succeeded / total;

      ruleStat.style = { "grid-template-columns": `${ruleStat.totals.succeeded}fr ${ruleStat.totals.attempted}fr ${ruleStat.totals.missed}fr` };

      outputStats.push(ruleStat);
    }

    return outputStats;
  }

}
