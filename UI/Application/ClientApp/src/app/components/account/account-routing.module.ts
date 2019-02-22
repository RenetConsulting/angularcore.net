import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '../../guards/authentication/authentication.guard';

const routes: Routes = [
    /** public routes */
    { path: 'prep-reset-password', loadChildren: './prep-reset-password/prep-reset-password.module#PrepResetPasswordModule' },
    { path: 'reset-password', loadChildren: './reset-password/reset-password.module#ResetPasswordModule' },
    { path: 'confirm-email', loadChildren: './confirm-email/confirm-email.module#ConfirmEmailModule' },
    /** private routes */
    { path: 'change-password', canActivate: [AuthenticationGuard], loadChildren: './change-password/change-password.module#ChangePasswordModule' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
