import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CoreCaptchaAudioComponent } from './core-captcha-audio/core-captcha-audio.component';
import { CoreCaptchaComponent } from './core-captcha.component';
import { CoreCaptchaDirective } from './core-captcha.directive';

/** TODO: add provider to NGX_CORE_CAPTCHA_URL */
@NgModule({
    declarations: [CoreCaptchaComponent, CoreCaptchaDirective, CoreCaptchaAudioComponent],
    imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatCardModule, MatProgressSpinnerModule],
    exports: [CoreCaptchaComponent, CoreCaptchaDirective]
})
export class CoreCaptchaModule { }
