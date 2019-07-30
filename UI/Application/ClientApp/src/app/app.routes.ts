import { Route } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth/auth.guard';

export const ROUTES: Array<Route> = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },

    /** public routes */
    { path: 'home', component: HomeComponent },
    { path: 'profile', loadChildren: () => import('./components/profile/profile.module').then(m => m.ProfileModule) },

    /** account */
    { path: 'prep-reset-password', loadChildren: () => import('./components/account/prep-reset-password/prep-reset-password.module').then(m => m.PrepResetPasswordModule) },
    { path: 'reset-password', loadChildren: () => import('./components/account/reset-password/reset-password.module').then(m => m.ResetPasswordModule) },
    { path: 'confirm-email', loadChildren: () => import('./components/account/confirm-email/confirm-email.module').then(m => m.ConfirmEmailModule) },
    { path: 'change-password', canActivate: [AuthGuard], loadChildren: () => import('./components/account/change-password/change-password.module').then(m => m.ChangePasswordModule) },

    /** auth */
    { path: 'signin', loadChildren: () => import('./components/auth/signin/signin.module').then(m => m.SigninModule) },
    { path: 'signup', loadChildren: () => import('./components/auth/signup/signup.module').then(m => m.SignupModule) },
    { path: 'signin-google-problem', loadChildren: () => import('./components/auth/signin/google-problem/google-problem.module').then(m => m.GoogleProblemModule) },

    { path: 'blog', loadChildren: './components/blog-dashboard/blog-dashboard.module#BlogDashboardModule' },
    { path: 'blog/:blogId', loadChildren: './components/blog-detail/blog-detail.module#BlogDetailModule' },
    { path: 'blogs', loadChildren: './components/blog-list/blog-list.module#BlogListModule' },

    { path: '**', redirectTo: '/home' }
];
