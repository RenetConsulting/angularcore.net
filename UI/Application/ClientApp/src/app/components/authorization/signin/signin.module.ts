import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CoreCaptchaModule, NGX_CORE_CAPTCHA_OPTIONS } from '@renet-consulting/core-captcha';
import { ControlInputModule } from '~/components/control-input/control-input.module';
import { SocialMediaModule } from '~/components/social-media/social-media.module';
import { CORE_CAPTCHA_OPTIONS } from '~/consts/core-captcha-options';
import { SigninEffects } from './effects';
import { signinReducer } from './reducer';
import { SigninRoutingModule } from './signin-routing.module';
import { SigninComponent } from './signin.component';

@NgModule({
    declarations: [SigninComponent],
    providers: [
        { provide: NGX_CORE_CAPTCHA_OPTIONS, useValue: CORE_CAPTCHA_OPTIONS }
    ],
    imports: [
        CommonModule,
        SigninRoutingModule,
        ReactiveFormsModule,
        MatButtonModule,
        ControlInputModule,
        SocialMediaModule,
        MatCheckboxModule,
        MatCardModule,
        CoreCaptchaModule,
        StoreModule.forFeature('signin', signinReducer),
        EffectsModule.forRoot([SigninEffects]),
    ],
})
export class SigninModule { }
