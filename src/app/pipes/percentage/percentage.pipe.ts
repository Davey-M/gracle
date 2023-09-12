import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {

  transform(decimal: number): string {
    return `${(decimal * 100).toFixed(2)}%`;
  }

}
