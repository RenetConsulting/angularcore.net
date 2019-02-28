import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EffectsModule } from '@ngrx/effects';
import { ControlInputModule } from '../../control-input/control-input.module';
import { PrepResetPasswordEffects } from './effects';
import { PrepResetPasswordRoutingModule } from './prep-reset-password-routing.module';
import { PrepResetPasswordComponent } from './prep-reset-password.component';

const MODULES = [
    CommonModule,
    PrepResetPasswordRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    ControlInputModule,
    EffectsModule.forRoot([PrepResetPasswordEffects]),
];

const COMPONENTS = [
    PrepResetPasswordComponent
];

@NgModule({
    imports: [...MODULES],
    declarations: [...COMPONENTS]
})
export class PrepResetPasswordModule { }
