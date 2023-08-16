import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, combineLatest, map, skipWhile, takeUntil, tap } from 'rxjs';
import { gracleState, iGracleTile, iRule } from 'src/app/models/gracle';
import { RulesService } from 'src/app/services/rules/rules.service';
import { StateService } from 'src/app/services/state/state.service';

@Component({
  selector: 'app-output-display',
  templateUrl: './output-display.component.html',
  styleUrls: ['./output-display.component.css']
})
export class OutputDisplayComponent implements OnInit, OnDestroy {

  private _gracleResultString = '';
  gracleResultString$ = this._stateService.tileState$.pipe(
    map(tiles => this._formatStateToString(tiles)),
    tap(str => this._gracleResultString = str),
  );

  private _resultsCopyString = '';

  private _unsubscribe$ = new Subject<null>();

  constructor(private _stateService: StateService,
              private _rulesService: RulesService) { }

  ngOnInit(): void {
    combineLatest([
      this._stateService.tileState$,
      this._rulesService.rules$,      
    ]).pipe(
      takeUntil(this._unsubscribe$),
      skipWhile(([tiles, rules]) => !tiles || !rules),
    ).subscribe(([tiles, rules]) => {
      this._setCopyString(tiles, rules);
    })
  }

  ngOnDestroy(): void {
      this._unsubscribe$.next(null);
  }

  private _formatStateToString(tiles: iGracleTile[]) {
    let outputString = '';

    for (let tile of tiles) {
      outputString += this._getTileColor(tile.state);
    }

    return outputString;
  }

  private _setCopyString(tiles: iGracleTile[], rules: iRule[]) {
    const outputArray: string[] = [];

    for (let tile of tiles) {
      const rule = rules.find(r => r.index === tile.ruleIndex);

      outputArray.push(`${this._getTileColor(tile.state)} ${rule?.summary}`);
    }

    this._resultsCopyString = outputArray.join('\n');
  }

  private _getTileColor(state: gracleState) {
    switch (state) {
      case gracleState.inProgress:
        return '⬛';
      case gracleState.attempted:
        return '🟨';
      case gracleState.succeeded:
        return '🟩';
    }
  }

  async copyResults() {
    await navigator.clipboard.writeText(this._resultsCopyString);
    alert('Results were copied to clipboard.');
  }

}
