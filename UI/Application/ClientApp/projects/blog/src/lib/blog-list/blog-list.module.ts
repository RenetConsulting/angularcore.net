import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BlogEffects } from '../effects';
import { blogReducer } from '../reducer';
import { BlogListRoutingModule } from './blog-list-routing.module';
import { BlogListComponent } from './blog-list.component';

@NgModule({
    declarations: [BlogListComponent],
    imports: [
        CommonModule,
        BlogListRoutingModule,
        StoreModule.forFeature('blog', blogReducer),
        EffectsModule.forFeature([BlogEffects]),
    ]
})
export class BlogListModule { }
