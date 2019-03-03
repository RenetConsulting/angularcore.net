import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { EffectsModule } from '@ngrx/effects';
import { ResendConfirmationEffects } from './effects';
import { ResendConfirmationComponent } from './resend-confirmation.component';

const MODULES = [
    CommonModule,
    MatButtonModule,
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
