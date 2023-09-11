import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GracleMainComponent } from './components/gracle-main/gracle-main.component';
import { HandleBlankComponent } from './components/handle-blank/handle-blank.component';
import { StatsMainComponent } from './components/stats-main/stats-main.component';
import { ValidDateGuard } from './guards/valid-date/valid-date.guard';

const routes: Routes = [
  { path: 'stats', component: StatsMainComponent },
  { path: 'date/:date-string', component: GracleMainComponent, canActivate: [ ValidDateGuard ] },
  { path: '**', component: HandleBlankComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
