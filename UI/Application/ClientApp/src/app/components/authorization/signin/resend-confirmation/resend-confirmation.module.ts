import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { ResendConfirmationEffects } from './effects';
import { ResendConfirmationComponent } from './resend-confirmation.component';

@NgModule({
    exports: [ResendConfirmationComponent],
    declarations: [ResendConfirmationComponent],
    entryComponents: [ResendConfirmationComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        RouterModule,
        EffectsModule.forFeature([ResendConfirmationEffects])
    ],
})
export class ResendConfirmationModule { }
