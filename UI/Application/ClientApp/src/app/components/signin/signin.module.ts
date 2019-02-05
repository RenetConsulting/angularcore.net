import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ControlInputModule } from '../control.input/control.input.module';
import { SigninRoutingModule } from './signin-routing.module';
import { SigninComponent } from './signin.component';

const MODULES = [
    CommonModule,
    SigninRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    ControlInputModule
];

const COMPONENTS = [
    SigninComponent
];

@NgModule({
    imports: [
        ...MODULES
    ],
    declarations: [
        ...COMPONENTS
    ]
})
export class SigninModule { }
