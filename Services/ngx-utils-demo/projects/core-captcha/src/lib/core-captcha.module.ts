import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMatInputModule } from '@renet-consulting/ngx-mat-input/src/public-api';
import { CoreCaptchaAudioComponent } from './core-captcha-audio/core-captcha-audio.component';
import { CoreCaptchaComponent } from './core-captcha.component';
import { CoreCaptchaDirective } from './core-captcha.directive';

@NgModule({
    declarations: [CoreCaptchaComponent, CoreCaptchaDirective, CoreCaptchaAudioComponent],
    exports: [CoreCaptchaComponent, CoreCaptchaDirective],
    imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule, NgxMatInputModule],
})
export class CoreCaptchaModule { }
