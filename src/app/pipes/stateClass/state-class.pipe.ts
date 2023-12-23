import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map, } from 'rxjs';
import { gracleState } from 'src/app/models/gracle';
import { StateService } from 'src/app/services/state/state.service';

@Pipe({
  name: 'stateClass'
})
export class StateClassPipe implements PipeTransform {

  constructor(private _stateService: StateService) { }

  transform(value: number): Observable<string> {
    return this._stateService.tileState$.pipe(
      map(tiles => {
        const current = tiles.find(tile => tile.ruleIndex === value);
        switch (current?.state) {
          case gracleState.inProgress:
            return 'in-progress';
          case gracleState.attempted:
            return 'attempted';
          case gracleState.succeeded:
            return 'succeeded';
          default:
            throw `No state exists for tile with index: ${value}`;
        }
      }),
    );
  }
}
