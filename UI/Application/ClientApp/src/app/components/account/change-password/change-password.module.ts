import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { metaReducers } from '../../../reducers';
import { ControlInputModule } from '../../control-input/control-input.module';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { ChangePasswordComponent } from './change-password.component';
import { ChangePasswordEffects } from './effects';
import { changePasswordReducer } from './reducer';

const MODULES = [
    CommonModule,
    ChangePasswordRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    ControlInputModule,
    StoreModule.forRoot({ changePassword: changePasswordReducer }, { metaReducers }),
    EffectsModule.forRoot([ChangePasswordEffects]),
];

const COMPONENTS = [
    ChangePasswordComponent
];

@NgModule({
    imports: [
        ...MODULES
    ],
    declarations: [
        ...COMPONENTS
    ]
})
export class ChangePasswordModule { }
