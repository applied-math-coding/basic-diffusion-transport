import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { PlotlyViaWindowModule } from 'angular-plotly.js';
import { CheckboxModule, Checkbox } from 'primeng/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SpinnerModule } from 'primeng/spinner';
import { RoundPipe } from './round.pipe';
import { SafeResourceUrl } from './safe-resource-url.pipe';
import { SafeUrlPipe } from './safe-url.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RoundPipe,
    SafeResourceUrl,
    SafeUrlPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    ButtonModule,
    CheckboxModule,
    DropdownModule,
    SpinnerModule,
    PlotlyViaWindowModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
