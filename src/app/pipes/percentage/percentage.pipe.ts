import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {

  transform(decimal: number, number?: number): string {
    if (number !== undefined) {
      return `${number} / ${(decimal * 100).toFixed(2)}%`;
    } else {
      return `${(decimal * 100).toFixed(2)}%`;
    }
  }

}
