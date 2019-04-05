import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EffectsModule } from '@ngrx/effects';
import { ControlInputModule } from '~/components/control-input/control-input.module';
import { PrepResetPasswordEffects } from './effects';
import { PrepResetPasswordRoutingModule } from './prep-reset-password-routing.module';
import { PrepResetPasswordComponent } from './prep-reset-password.component';

@NgModule({
    declarations: [PrepResetPasswordComponent],
    imports: [
        CommonModule,
        PrepResetPasswordRoutingModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        ControlInputModule,
        EffectsModule.forRoot([PrepResetPasswordEffects]),
    ],
})
export class PrepResetPasswordModule { }
