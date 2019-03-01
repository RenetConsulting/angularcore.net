import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreCaptchaModule, NGX_CORE_CAPTCHA_URL } from 'projects/core-captcha/src/public_api';
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
        CoreCaptchaModule,
    ],
    providers: [
        { provide: NGX_CORE_CAPTCHA_URL, useValue: 'https://corecaptcha.azurewebsites.net/api/CaptchaCreate' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
