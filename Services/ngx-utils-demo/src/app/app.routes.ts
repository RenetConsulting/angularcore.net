import { Routes } from '@angular/router';

export const ROUTES: Routes = [
    // { path: '', redirectTo: '', pathMatch: 'full' },

    { path: 'captcha', loadChildren: './captcha/captcha.module#CaptchaModule' },

    { path: '**', redirectTo: '' }
];
