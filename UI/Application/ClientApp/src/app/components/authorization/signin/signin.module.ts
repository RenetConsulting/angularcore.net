import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ControlInputModule } from '../../control-input/control-input.module';
import { SocialMediaModule } from '../../social-media/social-media.module';
import { SigninRoutingModule } from './signin-routing.module';
import { SigninComponent } from './signin.component';

const MODULES = [
    CommonModule,
    SigninRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    ControlInputModule,
    SocialMediaModule,
    MatCheckboxModule
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
