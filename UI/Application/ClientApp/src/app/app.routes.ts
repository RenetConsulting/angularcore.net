import { Route } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';

export const ROUTES: Array<Route> = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },

    /** public routes */
    { path: 'home', component: HomeComponent },
    { path: 'counter', loadChildren: './components/counter/counter.module#CounterModule' },
    { path: 'profile', loadChildren: './components/profile/profile.module#ProfileModule' },

    /** account */
    { path: 'prep-reset-password', loadChildren: './components/account/prep-reset-password/prep-reset-password.module#PrepResetPasswordModule' },
    { path: 'reset-password', loadChildren: './components/account/reset-password/reset-password.module#ResetPasswordModule' },
    { path: 'confirm-email', loadChildren: './components/account/confirm-email/confirm-email.module#ConfirmEmailModule' },
    { path: 'change-password', canActivate: [AuthenticationGuard], loadChildren: './components/account/change-password/change-password.module#ChangePasswordModule' },

    /** auth */
    { path: 'signin', loadChildren: './components/auth/signin/signin.module#SigninModule' },
    { path: 'signup', loadChildren: './components/auth/signup/signup.module#SignupModule' },

    { path: '**', redirectTo: '/home' }
];