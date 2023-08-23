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

  private _dateStringForCopying = '';

  constructor(private _stateService: StateService,
              private _rulesService: RulesService) { }

  ngOnInit(): void {
    // This has to be before the next observable 
    // or the set copy string will be behind.
    this._stateService.selectedDate$.pipe(
      takeUntil(this._unsubscribe$),
    ).subscribe(date => {
      this._dateStringForCopying = this._formatDate(date);
    });

    combineLatest([
      this._stateService.tileState$,
      this._rulesService.rules$,      
    ]).pipe(
      takeUntil(this._unsubscribe$),
      skipWhile(([tiles, rules]) => !tiles || !rules),
    ).subscribe(([tiles, rules]) => {
      this._setCopyString(tiles, rules);
    });
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
    const outputArray: string[] = [ this._dateStringForCopying ];

    for (let tile of tiles) {
      const rule = rules[tile.ruleIndex];

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

  private _formatDate(dateString: string): string {
    const [ year, month, day ] = dateString.split('-').map(str => parseInt(str));

    const monthStr = this._getReadableMonth(month);

    return `${monthStr} ${day}, ${year}:`;
  }

  private _getReadableMonth(index: number): string {
    switch (index) {
      case 0:
        return 'Jan';
      case 1:
        return 'Feb';
      case 2:
        return 'Mar';
      case 3:
        return 'Apr';
      case 4:
        return 'May';
      case 5:
        return 'Jun';
      case 6:
        return 'Jul';
      case 7:
        return 'Aug';
      case 8:
        return 'Sep';
      case 9:
        return 'Oct';
      case 10:
        return 'Nov';
      case 11:
        return 'Dec';
      default:
        throw `${index} is not a valid month index`;
    }
  }

}
