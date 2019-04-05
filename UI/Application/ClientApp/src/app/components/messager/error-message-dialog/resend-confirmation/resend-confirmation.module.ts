import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { EffectsModule } from '@ngrx/effects';
import { ResendConfirmationEffects } from './effects';
import { ResendConfirmationComponent } from './resend-confirmation.component';

@NgModule({
    exports: [ResendConfirmationComponent],
    declarations: [ResendConfirmationComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        EffectsModule.forFeature([ResendConfirmationEffects])
    ],
})
export class ResendConfirmationModule { }
