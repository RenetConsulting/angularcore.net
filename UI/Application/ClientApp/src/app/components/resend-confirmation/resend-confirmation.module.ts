import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ResendConfirmationComponent } from './resend-confirmation.component';

const MODULES = [
    CommonModule,
];

const COMPONENTS = [
    ResendConfirmationComponent
];

@NgModule({
    imports: [
        ...MODULES
    ],
    declarations: [
        ...COMPONENTS
    ]
})
export class ResendConfirmationModule { }
