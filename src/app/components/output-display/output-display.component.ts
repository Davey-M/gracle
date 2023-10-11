import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, combineLatest, map, skipWhile, take, takeUntil, tap } from 'rxjs';
import { gracleState, iGracleTile, iRule } from 'src/app/models/gracle';
import { RULES_VERSION, RulesService } from 'src/app/services/rules/rules.service';
import { StateService } from 'src/app/services/state/state.service';
import { StorageService } from 'src/app/services/storage/storage.service';

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

  private _starIndex: number = -1;

  constructor(private _stateService: StateService,
              private _rulesService: RulesService,
              private _storageService: StorageService) { }

  ngOnInit(): void {
    // This has to be before the next observable 
    // or the set copy string will be behind.
    this._stateService.selectedDate$.pipe(
      takeUntil(this._unsubscribe$),
    ).subscribe(date => {
      this._dateStringForCopying = this._formatDate(date);
    });

    this._storageService.starRule$.pipe(
      takeUntil(this._unsubscribe$),
    ).subscribe(starRule => {
      if (!starRule || starRule?.version !== RULES_VERSION) {
        this._starIndex = -1;
      } else {
        this._starIndex = starRule.index;
      }
    })

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

      let starRuleString = '';
      if (tile.ruleIndex === this._starIndex) {
        starRuleString = '*';
      }

      outputArray.push(`${this._getTileColor(tile.state)} ${rule?.summary}${starRuleString}`);
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
      case gracleState.empty:
        return ' ';
    }
  }

  async copyResults() {
    if (navigator.share) {
      await navigator.share({
        text: this._resultsCopyString,
      });
    } else {
      await navigator.clipboard.writeText(this._resultsCopyString);
      alert('Results were copied to clipboard.');
    }
  }

  private _formatDate(dateString: string): string {
    const [ _, month, day ] = dateString.split('-').map(str => parseInt(str));

    const monthStr = this._getReadableMonth(month);

    return `${monthStr} ${day}${this._getNumberEnding(day)}`;
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

  private _getNumberEnding(n: number): string {
    switch (n) {
      case 0:
        return '';
      case 1:
      case 21:
      case 31:
        return 'st';
      case 2:
      case 22:
      case 32:
        return 'nd';
      case 3:
      case 23:
      case 33:
        return 'rd';
      default:
        return 'th';
    }
  }

}
