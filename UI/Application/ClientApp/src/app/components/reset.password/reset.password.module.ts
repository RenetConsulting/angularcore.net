import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ControlInputModule } from '../control.input/control.input.module';
import { LogoModule } from '../logo/logo.module';
import { ResetPasswordRoutingModule } from './reset.password-routing.module';
import { ResetPasswordComponent } from './reset.password.component';

const MODULES = [
    CommonModule,
    ResetPasswordRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    ControlInputModule,
    LogoModule
];

const COMPONENTS = [
    ResetPasswordComponent
];

@NgModule({
    imports: [
        ...MODULES
    ],
    declarations: [
        ...COMPONENTS
    ]
})
export class ResetPasswordModule { }
