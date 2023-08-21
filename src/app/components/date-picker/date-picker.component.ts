import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { iDateOption } from 'src/app/models/date';
import { iGracle } from 'src/app/models/gracle';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent {

  today: iDateOption = {
    date: this._storageService.getDateString(),
    value: new Date(),
  };
  yesterday = this._getPreviousDate();

  options$ = this._storageService.store$.pipe(
    map(gracleList => this._getOptionsFromList(gracleList)),
  );

  constructor(private _storageService: StorageService,
              private _router: Router) { }

  public handleInputChange(event: any) {
    const date = event.target.value;
    this._router.navigate([ date ]);
  }

  private _getOptionsFromList(gracleList: iGracle[]): iDateOption[] {
    return gracleList
      .filter(gracle => gracle.date !== this.today.date && gracle.date !== this.yesterday.date)
      .map(gracle => {
        return {
          date: gracle.date,
          value: this._getDateFromString(gracle.date),
        }
      });
  }

  private _getDateFromString(dateString: string): Date {
    const [ year, month, day ] = dateString
      .split('-')
      .map(str => parseInt(str));

    const date = new Date(year, month, day);
    return date;
  }

  private _getPreviousDate(): iDateOption {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    return {
      date: this._storageService.getDateString(date),
      value: date,
    }
  }

}
