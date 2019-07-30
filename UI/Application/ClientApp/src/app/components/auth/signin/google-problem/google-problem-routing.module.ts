import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoogleProblemComponent } from './google-problem.component';

const routes: Routes = [{ path: '', component: GoogleProblemComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GoogleProblemRoutingModule { }
