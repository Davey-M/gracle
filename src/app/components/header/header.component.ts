import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, fromEvent, map, startWith } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private _isOpen$ = new BehaviorSubject<boolean>(false);

  private _scrollListener$ = fromEvent(window, 'scroll');
  private _showHeaderShadow$ = this._scrollListener$.pipe(
    startWith(() => window.scrollY > 0),
    map(() => window.scrollY > 0)
  );
  
  containerStyle$ = this._isOpen$.pipe(
    map(isOpen => {
      return {
        'margin-top.vh': isOpen ? 0 : -100,
      }
    }),
  );

  headerStyle$ = combineLatest([
    this._isOpen$,
    this._showHeaderShadow$,
  ]).pipe(
    map(([ isOpen, showShadow ]) => {
      return {
        'margin-top.vh': isOpen ? 100 : 0,
        'box-shadow': showShadow ? 'var(--shadow)' : 'none',
      }
    })
  );

  constructor() { }

  ngOnInit(): void {
  }

  toggleHeaderState() {
    this._isOpen$.next(!this._isOpen$.value);
  }

}
