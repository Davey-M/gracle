import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { iGracle } from 'src/app/models/gracle';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {

  dates$ = this._storageService.store$.pipe(
    map(store => this._getDatesFromGracle(store)),
  );

  constructor(private _storageService: StorageService) { }

  ngOnInit(): void {
  }

  private _getDatesFromGracle(store: iGracle[]): Date[] {
    return store.map(storeItem => {
      const dateString = storeItem.date;

      const [ year, month, day ] = dateString.split('-').map(str => parseInt(str));

      const date = new Date(year, month, day);
      return date;
    });
  }

}
