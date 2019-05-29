import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '~/guards/auth/auth.guard';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
    { path: '', canActivate: [AuthGuard], component: ProfileComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
