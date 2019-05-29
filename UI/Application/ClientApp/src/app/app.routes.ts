import { Route } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth/auth.guard';

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
    { path: 'change-password', canActivate: [AuthGuard], loadChildren: './components/account/change-password/change-password.module#ChangePasswordModule' },

    /** auth */
    { path: 'signin', loadChildren: './components/auth/signin/signin.module#SigninModule' },
    { path: 'signup', loadChildren: './components/auth/signup/signup.module#SignupModule' },

    { path: 'blog', loadChildren: './components/blog-dashboard/blog-dashboard.module#BlogDashboardModule' },
    { path: 'blog/:blogId', loadChildren: './components/blog-detail/blog-detail.module#BlogDetailModule' },
    { path: 'blogs', loadChildren: './components/blog-list/blog-list.module#BlogListModule' },

    { path: '**', redirectTo: '/home' }
];