import { Routes } from '@angular/router';

export const ROUTES: Routes = [
    // { path: '', redirectTo: '', pathMatch: 'full' },

    { path: 'captcha', loadChildren: './captcha/captcha.module#CaptchaModule' },
    { path: 'input', loadChildren: './input/input.module#InputModule' },
    { path: 'validator', loadChildren: './validator/validator.module#ValidatorModule' },

    { path: '**', redirectTo: '' }
];
