import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isOpen$ = new BehaviorSubject<boolean>(false);
  
  containerStyle$ = this.isOpen$.pipe(
    map(isOpen => {
      return {
        'margin-top.vh': isOpen ? 0 : -100,
      }
    }),
  );

  headerStyle$ = this.isOpen$.pipe(
    map(isOpen => {
      return {
        'margin-top.vh': isOpen ? 100 : 0,
      }
    })
  );

  constructor() { }

  ngOnInit(): void {
  }

  toggleHeaderState() {
    this.isOpen$.next(!this.isOpen$.value);
  }

}
