import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CoreCaptchaComponent } from './core-captcha.component';
import { CoreCaptchaDirective } from './core-captcha.directive';

@NgModule({
    declarations: [CoreCaptchaComponent, CoreCaptchaDirective],
    imports: [CommonModule, ReactiveFormsModule, MatInputModule],
    exports: [CoreCaptchaComponent, CoreCaptchaDirective]
})
export class CoreCaptchaModule { }
