import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidatorDirective } from './validator.directive';

const MODULES = [
    CommonModule,
    ReactiveFormsModule
];

export const DIRECTIVES = [
    ValidatorDirective
];

@NgModule({
    imports: [
        ...MODULES
    ],
    exports: [
        ...DIRECTIVES
    ],
    declarations: [
        ...DIRECTIVES
    ]
})
export class ValidatorModule { }