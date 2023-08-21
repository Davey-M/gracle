import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GracleMainComponent } from './components/gracle-main/gracle-main.component';
import { HandleBlankComponent } from './components/handle-blank/handle-blank.component';

const routes: Routes = [
  { path: ':date-string', component: GracleMainComponent },
  { path: '**', component: HandleBlankComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
