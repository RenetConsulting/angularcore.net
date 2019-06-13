import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxMatInputModule } from '@renet-consulting/ngx-mat-input';
import { environment } from 'src/environments/environment';
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
        NgxMatInputModule,
        StoreModule.forRoot({ resetPassword: resetPasswordReducer }, { metaReducers: environment.metaReducers }),
        EffectsModule.forRoot([ResetPasswordEffects]),
    ],
})
export class ResetPasswordModule { }
