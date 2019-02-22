import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: 'sign-in', loadChildren: './signin/signin.module#SigninModule' },
    { path: 'sign-up', loadChildren: './signup/signup.module#SignupModule' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthorizationRoutingModule { }
