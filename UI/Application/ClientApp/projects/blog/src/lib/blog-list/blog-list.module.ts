import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BlogEffects } from '../effects';
import { MessageModule } from '../message/message.module';
import { blogReducer } from '../reducer';
import { BlogListRoutingModule } from './blog-list-routing.module';
import { BlogListComponent } from './blog-list.component';
import { BlogModule } from './blog/blog.module';

@NgModule({
    declarations: [BlogListComponent],
    imports: [
        CommonModule,
        BlogListRoutingModule,
        StoreModule.forFeature('blog', blogReducer),
        EffectsModule.forFeature([BlogEffects]),
        ScrollingModule,
        MessageModule,
        BlogModule
    ]
})
export class BlogListModule { }
