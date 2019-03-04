import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SigninExternalComponent } from './signin-external.component';

const MODULES = [
    CommonModule,
    MatButtonModule
];

const COMPONENTS = [
    SigninExternalComponent
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [...MODULES],
    exports: [...COMPONENTS],
})
export class SigninExternalModule { }
