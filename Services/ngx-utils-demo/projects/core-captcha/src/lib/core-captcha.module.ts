import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CoreCaptchaAudioComponent } from './core-captcha-audio/core-captcha-audio.component';
import { CoreCaptchaComponent } from './core-captcha.component';
import { CoreCaptchaDirective } from './core-captcha.directive';

@NgModule({
    declarations: [CoreCaptchaComponent, CoreCaptchaDirective, CoreCaptchaAudioComponent],
    exports: [CoreCaptchaComponent, CoreCaptchaDirective],
    imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatProgressSpinnerModule],
})
export class CoreCaptchaModule { }
