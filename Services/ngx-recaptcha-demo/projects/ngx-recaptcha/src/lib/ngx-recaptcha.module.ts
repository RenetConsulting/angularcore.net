import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgxRecaptchaComponent } from './ngx-recaptcha.component';
import { NgxRecaptchaDirective } from './ngx-recaptcha.directive';

@NgModule({
    declarations: [NgxRecaptchaComponent, NgxRecaptchaDirective],
    imports: [CommonModule, ReactiveFormsModule, MatInputModule],
    exports: [NgxRecaptchaComponent, NgxRecaptchaDirective]
})
export class NgxRecaptchaModule { }
