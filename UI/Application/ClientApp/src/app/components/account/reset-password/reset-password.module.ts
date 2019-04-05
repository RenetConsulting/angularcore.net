import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { ControlInputModule } from '~/components/control-input/control-input.module';
import { ResetPasswordEffects } from './effects';
import { resetPasswordReducer } from './reducer';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './reset-password.component';

@NgModule({
    declarations: [ResetPasswordComponent],
    imports: [
        CommonModule,
        ResetPasswordRoutingModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        ControlInputModule,
        StoreModule.forRoot({ resetPassword: resetPasswordReducer }, { metaReducers: environment.metaReducers }),
        EffectsModule.forRoot([ResetPasswordEffects]),
    ],
})
export class ResetPasswordModule { }
