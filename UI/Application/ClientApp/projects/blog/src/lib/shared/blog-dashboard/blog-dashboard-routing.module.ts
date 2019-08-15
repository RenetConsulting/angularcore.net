import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogDashboardComponent } from './blog-dashboard.component';

const routes: Routes = [
    { path: '', component: BlogDashboardComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BlogDashboardRoutingModule { }
