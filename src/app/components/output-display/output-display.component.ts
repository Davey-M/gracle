import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs';
import { gracleState, iGracleTile } from 'src/app/models/gracle';
import { StateService } from 'src/app/services/state/state.service';

@Component({
  selector: 'app-output-display',
  templateUrl: './output-display.component.html',
  styleUrls: ['./output-display.component.css']
})
export class OutputDisplayComponent implements OnInit {

  private _gracleResultString = '';
  gracleResultString$ = this._stateService.tileState$.pipe(
    map(tiles => this._formatStateToString(tiles)),
    tap(str => this._gracleResultString = str),
  );

  constructor(private _stateService: StateService) { }

  ngOnInit(): void {
  }

  private _formatStateToString(tiles: iGracleTile[]) {
    let outputString = 'Gracle: ';

    for (let tile of tiles) {
      switch (tile.state) {
        case gracleState.inProgress:
          outputString += '⬛';
          break;
        case gracleState.attempted:
          outputString += '🟨';
          break;
        case gracleState.succeeded:
          outputString += '🟩';
          break;
      }
    }

    return outputString;
  }

  async copyResults() {
    await navigator.clipboard.writeText(this._gracleResultString);
    alert('Results were copied to clipboard.');
  }

}
