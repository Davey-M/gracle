import { Component } from '@angular/core';
import { RulesService } from './services/rules/rules.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gracle';

  rules = this._rulesService.rules$;

  constructor(private _rulesService: RulesService) { }
}
