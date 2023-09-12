import { Pipe, PipeTransform } from '@angular/core';
import { RulesService } from 'src/app/services/rules/rules.service';

@Pipe({
  name: 'ruleText'
})
export class RuleTextPipe implements PipeTransform {

  constructor(private _rulesService: RulesService) { }

  async transform(index: number, version: string): Promise<string> {
    const rules = await this._rulesService.getRulesVersion(version);

    const rule = rules[index];

    return rule.text;
  }

}
