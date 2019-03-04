import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: 'signin', loadChildren: './signin/signin.module#SigninModule' },
    { path: 'signup', loadChildren: './signup/signup.module#SignupModule' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthorizationRoutingModule { }
