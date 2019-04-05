import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CoreCaptchaModule, NGX_CORE_CAPTCHA_OPTIONS } from '@renet-consulting/core-captcha';
import { ControlInputModule } from '~/components/control-input/control-input.module';
import { SocialMediaModule } from '~/components/social-media/social-media.module';
import { CORE_CAPTCHA_OPTIONS } from '~/consts/core-captcha-options';
import { SignupEffects } from './effects';
import { signupReducer } from './reducer';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';

@NgModule({
    declarations: [SignupComponent],
    providers: [
        { provide: NGX_CORE_CAPTCHA_OPTIONS, useValue: CORE_CAPTCHA_OPTIONS }
    ],
    imports: [
        CommonModule,
        SignupRoutingModule,
        ReactiveFormsModule,
        MatButtonModule,
        ControlInputModule,
        SocialMediaModule,
        MatCheckboxModule,
        MatInputModule,
        MatCardModule,
        CoreCaptchaModule,
        StoreModule.forFeature('signup', signupReducer),
        EffectsModule.forRoot([SignupEffects]),
    ]
})
export class SignupModule { }
