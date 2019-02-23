import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ControlInputModule } from '../../control-input/control-input.module';
import { SocialMediaModule } from '../../social-media/social-media.module';
import { SigninEffects } from './effects';
import { signinReducer } from './reducer';
import { SigninRoutingModule } from './signin-routing.module';
import { SigninComponent } from './signin.component';

const MODULES = [
    CommonModule,
    SigninRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    ControlInputModule,
    SocialMediaModule,
    MatCheckboxModule,
    MatCardModule,
    StoreModule.forFeature('signin', signinReducer),
    EffectsModule.forRoot([SigninEffects]),
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
