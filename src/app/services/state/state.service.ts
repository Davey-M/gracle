import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, skipWhile, switchMap, tap } from 'rxjs';
import { RULES_VERSION, RulesService } from '../rules/rules.service';
import { LocalStorageService } from '../storage/localStorage/storage.service';
import { gracleState, iGracle, iGracleTile, iRule } from 'src/app/models/gracle';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private _selectedIndex = 0;
  selectedGracle$ = new BehaviorSubject<iGracle>(this._storageService.store$.value[0]);

  selectedDate$ = this.selectedGracle$.pipe(
    map(gracle => gracle.date),
  );

  selectedRules$ = this.selectedGracle$.pipe(
    switchMap(gracle => {
      if (gracle.results.length === 0) {
        return this._rulesService.currentRules$;
      } else {
        const version = gracle.results[0].version;
        return this._rulesService.getRules(version);
      }
    }),
  );

  private _tileState: iGracleTile[] | null = null;
  tileState$ = combineLatest([
    this.selectedRules$,
    this.selectedGracle$,
  ]).pipe(
    skipWhile(([rules, selected]) => !rules || !selected),
    map(([rules, selected]) => this._formatTileState(rules, selected)),
    tap(state => this._tileState = state),
  );

  constructor(
    private _rulesService: RulesService,
    private _storageService: LocalStorageService,
  ) { }

  private _formatTileState(rules: iRule[], selected: iGracle): iGracleTile[] {
    return rules
      .map((_, ruleIndex) => {
        const currentTile = selected.results.find(tile => tile.ruleIndex === ruleIndex);

        if (currentTile) {
          return currentTile;
        }
        else {
          return {
            ruleIndex,
            state: gracleState.inProgress,
            version: RULES_VERSION
          }
        }
      });
  }

  public updateTile(ruleIndex: number) {
    if (this._tileState === null) throw 'Tile state is null';

    console.log(this._selectedIndex);

    // update todays results
    const updatedResults = this._tileState.map<iGracleTile>(tile => {
      if (tile.ruleIndex === ruleIndex) {
        return {
          ruleIndex,
          state: this._switchTileState(tile.state),
          version: tile.version
        };
      } else {
        return tile;
      }
    });

    const updatedStore = this._storageService.store$.value;
    if (updatedStore === null) throw 'No Gracle store found';

    const updatedGracle = {
      date: updatedStore[this._selectedIndex].date,
      results: updatedResults,
    };
    updatedStore[this._selectedIndex] = updatedGracle;

    this._storageService.store$.next(updatedStore);
    this.selectedGracle$.next(updatedGracle);
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
      default:
        return gracleState.empty;
    }
  }

  public selectGracleByDate(dateString: string): void {
    const store = this._storageService.store$.value;

    const index = store.findIndex(value => value.date === dateString);

    if (index >= 0) {
      this._selectedIndex = index;
      const gracle = store[this._selectedIndex];
      this.selectedGracle$.next(gracle);
    } else {
      store.push({
        date: dateString,
        results: [],
      });
      store.sort((a, b) => {
        return this._getMSFromDateString(b.date) - this._getMSFromDateString(a.date)
      });

      this._storageService.store$.next(store);
      this._storageService.saveState();
      window.location.reload();
    }
  }

  private _getMSFromDateString(dateString: string): number {
    const [ year, month, day ] = dateString.split('-').map(parseInt);
    const date = new Date(year, month, day);
    return date.getTime();
  }

}
