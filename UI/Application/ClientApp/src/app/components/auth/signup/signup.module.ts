import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { EffectsModule } from '@ngrx/effects';
import { CoreCaptchaModule, NGX_CORE_CAPTCHA_OPTIONS } from '@renet-consulting/core-captcha';
import { NgxMatInputModule } from '@renet-consulting/ngx-mat-input';
import { SocialMediaModule } from '~/components/social-media/social-media.module';
import { CORE_CAPTCHA_OPTIONS } from '~/consts/core-captcha-options';
import { SignupEffects } from './effects';
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
        NgxMatInputModule,
        SocialMediaModule,
        MatCheckboxModule,
        MatInputModule,
        MatCardModule,
        CoreCaptchaModule,
        EffectsModule.forFeature([SignupEffects]),
    ]
})
export class SignupModule { }
