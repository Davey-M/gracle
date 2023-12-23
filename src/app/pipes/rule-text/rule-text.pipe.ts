import { Pipe, PipeTransform } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RulesService } from 'src/app/services/rules/rules.service';

@Pipe({
  name: 'ruleText'
})
export class RuleTextPipe implements PipeTransform {

  constructor(private _rulesService: RulesService) { }

  transform(index: number, version: string): Observable<string> {
    return this._rulesService.getRules(version).pipe(
      map(rules => rules[index].text),
    );
  }
}
