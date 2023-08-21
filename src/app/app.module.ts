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

@NgModule({
  declarations: [
    AppComponent,
    RuleInputComponent,
    StateClassPipe,
    OutputDisplayComponent,
    DatePickerComponent,
    GracleMainComponent,
    HandleBlankComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
