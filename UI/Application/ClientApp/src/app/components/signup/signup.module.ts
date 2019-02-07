import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { ControlInputModule } from '../control.input/control.input.module';
import { LogoModule } from '../logo/logo.module';
import { SocialMediaModule } from '../social.media/social.media.module';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';

const MODULES = [
    CommonModule,
    SignupRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    ControlInputModule,
    LogoModule,
    SocialMediaModule,
    MatCheckboxModule,
    MatInputModule
];

const COMPONENTS = [
    SignupComponent
];

@NgModule({
    imports: [
        ...MODULES
    ],
    declarations: [
        ...COMPONENTS
    ]
})
export class SignupModule { }
