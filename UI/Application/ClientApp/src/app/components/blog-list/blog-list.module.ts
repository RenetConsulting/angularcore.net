import { NgModule } from '@angular/core';
import { BlogListModule as ListModule } from 'projects/blog/src/public-api';
//import { BlogListModule as ListModule } from 'blog'; // to load from bundles

/** here should be a wrapper for lazy lib modules */
@NgModule({
  imports: [
      ListModule
  ]
})
export class BlogListModule { }
