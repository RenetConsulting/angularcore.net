import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxRecaptchaModule } from 'projects/ngx-recaptcha/src/public_api';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      ReactiveFormsModule,
      NgxRecaptchaModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
