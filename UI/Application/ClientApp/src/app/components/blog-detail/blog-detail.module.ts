import { NgModule } from '@angular/core';
import { BlogDetailModule as DetailModule } from 'projects/blog/src/public-api';
// import { BlogDetailModule as DetailModule } from 'blog'; // to load from bundles

/** here should be a wrapper for lazy lib modules */
@NgModule({
  imports: [
      DetailModule
  ]
})
export class BlogDetailModule { }
