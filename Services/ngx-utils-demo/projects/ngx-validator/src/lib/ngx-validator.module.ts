import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxValidatorDirective } from './ngx-validator.directive';

@NgModule({
    declarations: [NgxValidatorDirective],
    exports: [NgxValidatorDirective],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
})
export class NgxValidatorModule { }
