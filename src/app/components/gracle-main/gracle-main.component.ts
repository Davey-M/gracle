import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, map, takeUntil } from 'rxjs';
import { StateService } from 'src/app/services/state/state.service';

@Component({
  selector: 'app-gracle-main',
  templateUrl: './gracle-main.component.html',
  styleUrls: ['./gracle-main.component.css']
})
export class GracleMainComponent implements OnInit, OnDestroy {

  unsubscribe$ = new Subject<null>();

  dateParam$ = this._route.paramMap.pipe(
    map(paramMap => paramMap.get('date-string')),
  );

  constructor(private _route: ActivatedRoute,
              private _stateService: StateService) { }

  ngOnInit(): void {
    this.dateParam$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(dateString => {
      if (dateString !== null) {
        this._stateService.selectGracleByDate(dateString);
      }
    });
  }

  ngOnDestroy(): void {
      this.unsubscribe$.next(null);
  }

}
