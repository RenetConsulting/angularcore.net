import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '~/guards/authentication/authentication.guard';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
    { path: '', canActivate: [AuthenticationGuard], component: ProfileComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
