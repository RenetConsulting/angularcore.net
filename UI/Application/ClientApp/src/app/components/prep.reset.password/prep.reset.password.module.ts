import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ControlInputModule } from '../control.input/control.input.module';
import { LogoModule } from '../logo/logo.module';
import { PrepResetPasswordRoutingModule } from './prep.reset.password-routing.module';
import { PrepResetPasswordComponent } from './prep.reset.password.component';

const MODULES = [
    CommonModule,
    PrepResetPasswordRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    ControlInputModule,
    LogoModule
];

const COMPONENTS = [
    PrepResetPasswordComponent
];

@NgModule({
    imports: [
        ...MODULES
    ],
    declarations: [
        ...COMPONENTS
    ]
})
export class PrepResetPasswordModule { }
