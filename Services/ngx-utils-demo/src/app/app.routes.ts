import { Routes } from '@angular/router';

export const ROUTES: Routes = [
    // { path: '', redirectTo: '', pathMatch: 'full' },

    { path: 'captcha', loadChildren: './captcha/captcha.module#CaptchaModule' },
    { path: 'input', loadChildren: './input/input.module#InputModule' },
    { path: 'validator', loadChildren: './validator/validator.module#ValidatorModule' },
    { path: 'uploader', loadChildren: './uploader/uploader.module#UploaderModule' },
    { path: 'messenger', loadChildren: './messenger/messenger.module#MessagerModule' },
    { path: 'storage', loadChildren: './storage/storage.module#StorageModule' },

    { path: '**', redirectTo: '' }
];
