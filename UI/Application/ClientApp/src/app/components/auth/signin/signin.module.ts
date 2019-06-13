import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EffectsModule } from '@ngrx/effects';
import { CoreCaptchaModule, NGX_CORE_CAPTCHA_OPTIONS } from '@renet-consulting/core-captcha';
import { FacebookSigninModule, GoogleSigninModule } from '@renet-consulting/external-auth';
import { NgxMatInputModule } from '@renet-consulting/ngx-mat-input';
import { NgxMessengerModule } from '@renet-consulting/ngx-messenger';
import { SocialMediaModule } from '~/components/social-media/social-media.module';
import { CORE_CAPTCHA_OPTIONS } from '~/consts/core-captcha-options';
import { SigninEffects } from './effects';
import { ResendConfirmationModule } from './resend-confirmation/resend-confirmation.module';
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
        NgxMatInputModule,
        SocialMediaModule,
        MatCheckboxModule,
        MatCardModule,
        CoreCaptchaModule,
        EffectsModule.forRoot([SigninEffects]),
        ResendConfirmationModule,
        FacebookSigninModule,
        GoogleSigninModule,
        NgxMessengerModule,
    ],
})
export class SigninModule { }
