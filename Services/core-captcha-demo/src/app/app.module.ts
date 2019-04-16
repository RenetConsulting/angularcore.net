import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreCaptchaModule, ICoreCaptchaOptions, NGX_CORE_CAPTCHA_OPTIONS } from 'projects/core-captcha/src/public_api';
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
        {
            provide: NGX_CORE_CAPTCHA_OPTIONS,
            useValue: {
                url: 'https://corecaptcha.azurewebsites.net/api/CaptchaCreate',
                width: 500,
                height: 80,
                placeholder: 'Please type the text'
            } as ICoreCaptchaOptions
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
