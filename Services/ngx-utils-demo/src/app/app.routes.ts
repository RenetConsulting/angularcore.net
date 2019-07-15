import { Routes } from '@angular/router';

export const ROUTES: Routes = [
    // { path: '', redirectTo: '', pathMatch: 'full' },

    { path: 'captcha', loadChildren: () => import('./captcha/captcha.module').then(m => m.CaptchaModule) },
    { path: 'input', loadChildren: () => import('./input/input.module').then(m => m.InputModule) },
    { path: 'validator', loadChildren: () => import('./validator/validator.module').then(m => m.ValidatorModule) },
    { path: 'uploader', loadChildren: () => import('./uploader/uploader.module').then(m => m.UploaderModule) },
    { path: 'messenger', loadChildren: () => import('./messenger/messenger.module').then(m => m.MessagerModule) },
    { path: 'storage', loadChildren: () => import('./storage/storage.module').then(m => m.StorageModule) },

    { path: '**', redirectTo: '' }
];
