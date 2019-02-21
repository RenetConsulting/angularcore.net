import { Route } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';

export const ROUTES: Array<Route> = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },

    /** public routes */
    { path: 'home', component: HomeComponent },
    { path: 'sign-in', loadChildren: './components/signin/signin.module#SigninModule' },
    { path: 'sign-up', loadChildren: './components/signup/signup.module#SignupModule' },
    { path: 'prep-reset-password', loadChildren: './components/prep-reset-password/prep-reset-password.module#PrepResetPasswordModule' },
    { path: 'reset-password', loadChildren: './components/reset-password/reset-password.module#ResetPasswordModule' },
    { path: 'confirm-email', loadChildren: './components/confirm-email/confirm-email.module#ConfirmEmailModule' },
    { path: 'counter', loadChildren: './components/counter/counter.module#CounterModule' },

    /** private routes */
    {
        path: 'change-password', canActivate: [AuthenticationGuard],
        loadChildren: './components/change-password/change-password.module#ChangePasswordModule'
    },

    { path: '**', redirectTo: '/home' }
];