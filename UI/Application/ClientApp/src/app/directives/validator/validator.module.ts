import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidatorDirective } from './validator.directive';

@NgModule({
    declarations: [ValidatorDirective],
    exports: [ValidatorDirective],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
})
export class ValidatorModule { }