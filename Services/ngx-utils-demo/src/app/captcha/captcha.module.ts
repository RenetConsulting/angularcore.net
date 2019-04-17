import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreCaptchaModule, ICoreCaptchaOptions, NGX_CORE_CAPTCHA_OPTIONS } from 'projects/core-captcha/src/public_api';
import { CaptchaRoutingModule } from './captcha-routing.module';
import { CaptchaComponent } from './captcha.component';

@NgModule({
    declarations: [CaptchaComponent],
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
    imports: [
        CommonModule,
        CaptchaRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        CoreCaptchaModule,
    ]
})
export class CaptchaModule { }
