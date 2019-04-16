import { NgModule } from '@angular/core';
import { BlogDashboardModule as DashboardModule } from 'projects/blog/src/public-api';
//import { BlogDashboardModule as DashboardModule } from 'blog'; // to load from bundles

/** here should be a wrapper for lazy lib modules */
@NgModule({
    imports: [
        DashboardModule
    ]
})
export class BlogDashboardModule { }
