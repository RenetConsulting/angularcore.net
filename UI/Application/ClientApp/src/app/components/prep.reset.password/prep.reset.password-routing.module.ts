import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrepResetPasswordComponent } from './prep.reset.password.component';

const routes: Routes = [
    { path: '', component: PrepResetPasswordComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrepResetPasswordRoutingModule { }
