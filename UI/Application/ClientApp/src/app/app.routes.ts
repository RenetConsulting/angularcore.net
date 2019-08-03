// tslint:disable: max-line-length
import { Route } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth/auth.guard';

export const ROUTES: Array<Route> = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },

    {
        path: 'blog-dashboard',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/blog-dashboard/blog-dashboard.module').then(m => m.BlogDashboardModule),
        data: { title: 'Blog Dashboard' },
    },
    {
        path: 'blog-detail/:blogId',
        loadChildren: () => import('./components/blog-detail/blog-detail.module').then(m => m.BlogDetailModule),
    },
    {
        path: 'blogs',
        loadChildren: () => import('./components/blog-list/blog-list.module').then(m => m.BlogListModule),
        data: { title: 'Blogs' },
    },
    {
        path: 'change-password',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/account/change-password/change-password.module').then(m => m.ChangePasswordModule),
        data: { title: 'Change Password' },
    },
    {
        path: 'confirm-email',
        loadChildren: () => import('./components/account/confirm-email/confirm-email.module').then(m => m.ConfirmEmailModule),
        data: { title: 'Confirm Email' },
    },
    {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Home' },
    },
    {
        path: 'prep-reset-password',
        loadChildren: () => import('./components/account/prep-reset-password/prep-reset-password.module').then(m => m.PrepResetPasswordModule),
        data: { title: 'Pre Reset Password' },
    },
    {
        path: 'profile',
        loadChildren: () => import('./components/profile/profile.module').then(m => m.ProfileModule),
        data: { title: 'Profile' },
    },
    {
        path: 'reset-password',
        loadChildren: () => import('./components/account/reset-password/reset-password.module').then(m => m.ResetPasswordModule),
        data: { title: 'Reset Password' },
    },
    {
        path: 'signin',
        loadChildren: () => import('./components/auth/signin/signin.module').then(m => m.SigninModule),
        data: { title: 'Sign In' },
    },
    {
        path: 'signin-google-problem',
        loadChildren: () => import('./components/auth/signin/google-problem/google-problem.module').then(m => m.GoogleProblemModule),
        data: { title: 'Signin Google Problem' },
    },
    {
        path: 'signup',
        loadChildren: () => import('./components/auth/signup/signup.module').then(m => m.SignupModule),
        data: { title: 'Sign Up' },
    },

    { path: '**', redirectTo: '/home' }
];
