import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ControlInputModule } from '../../control-input/control-input.module';
import { SocialMediaModule } from '../../social-media/social-media.module';
import { SignupEffects } from './effects';
import { signupReducer } from './reducer';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';

const MODULES = [
    CommonModule,
    SignupRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    ControlInputModule,
    SocialMediaModule,
    MatCheckboxModule,
    MatInputModule,
    StoreModule.forFeature('signup', signupReducer),
    EffectsModule.forRoot([SignupEffects]),
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
