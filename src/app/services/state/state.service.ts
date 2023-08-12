import { Injectable } from '@angular/core';
import { combineLatest, map, skipWhile, tap } from 'rxjs';
import { RulesService } from '../rules/rules.service';
import { StorageService } from '../storage/storage.service';
import { gracleState, iGracle, iGracleTile, iRule } from 'src/app/models/gracle';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private _tileState: iGracleTile[] | null = null;
  tileState$ = combineLatest([
    this._rulesService.rules$,
    this._storageService.today$,
  ]).pipe(
    skipWhile(([rules, today]) => !rules || !today),
    map(([rules, today]) => this._formatTileState(rules, today)),
    tap(state => this._tileState = state),
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

  updateTile(ruleIndex: number) {
    if (this._tileState === null) throw 'Tile state is null';

    // update todays results
    const updatedResults = this._tileState.map<iGracleTile>(tile => {
      if (tile.ruleIndex === ruleIndex) {
        return {
          ruleIndex,
          state: this._switchTileState(tile.state),
        };
      } else {
        return tile;
      }
    });

    const updatedStore = this._storageService.store$.value;
    if (updatedStore === null) throw 'No Gracle store found';

    updatedStore[0] = {
      date: this._storageService.getDateString(),
      results: updatedResults,
    };

    this._storageService.store$.next(updatedStore);
    this._storageService.saveState();
  }

  private _switchTileState(state: gracleState): gracleState {
    switch (state) {
      case gracleState.inProgress:
        return gracleState.attempted;
      case gracleState.attempted:
        return gracleState.succeeded;
      case gracleState.succeeded:
        return gracleState.inProgress;
    }
  }
}
