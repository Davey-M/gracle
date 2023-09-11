import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidDateGuard implements CanActivate {

  private _validDatePattern = /[\d]+-[\d]+-[\d]+/;

  constructor(private _router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const dateParam = route.paramMap.get('date-string');

    const isValidDate = this._checkDate(dateParam);

    if (!isValidDate) {
      this._router.navigate([ '' ]);
    }

    return isValidDate;
  }

  private _checkDate(date: string | null): boolean {
    if (date === null) return false;
      
    // if this check fails we don't need to try to convert it to a date object
    if (!this._validDatePattern.test(date)) return false;

    // make sure that the date provided can be converted into a date object
    try {
      const [ year, month, day ] = date.split('-').map(Number);

      const dateObject = new Date(year, month, day);

      // dateObject.getTime() will be NaN if dateObject is invalid and NaN will not equal itself
      if (dateObject.getTime() !== dateObject.getTime()) return false;
    } catch {
      return false;
    }

    return true;
  }

}
