import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ResendConfirmationEffects } from './effects';
import { ResendConfirmationComponent } from './resend-confirmation.component';

const MODULES = [
    CommonModule,
    EffectsModule.forFeature([ResendConfirmationEffects])
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
    ],
    exports: [
        ...COMPONENTS
    ],
})
export class ResendConfirmationModule { }
