import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RuleInputComponent } from './components/rule-input/rule-input.component';
import { StateClassPipe } from './pipes/stateClass/state-class.pipe';
import { OutputDisplayComponent } from './components/output-display/output-display.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { GracleMainComponent } from './components/gracle-main/gracle-main.component';
import { HandleBlankComponent } from './components/handle-blank/handle-blank.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HeaderComponent } from './components/header/header.component';
import { StatsMainComponent } from './components/stats-main/stats-main.component';

@NgModule({
  declarations: [
    AppComponent,
    RuleInputComponent,
    StateClassPipe,
    OutputDisplayComponent,
    DatePickerComponent,
    GracleMainComponent,
    HandleBlankComponent,
    HeaderComponent,
    StatsMainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
