import { Injectable } from '@angular/core';
import { iGracleTile } from 'src/app/models/gracle';
import { RulesService } from '../rules/rules.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private _rulesService: RulesService) { }

  async getRuleId(tile: iGracleTile) {
    const rules = await this._rulesService.getRulesAsync(tile.version);
    return rules[tile.ruleIndex].id;
  }
}
