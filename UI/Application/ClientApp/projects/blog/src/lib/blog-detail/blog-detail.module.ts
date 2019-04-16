import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { EditorModule } from '../editor/editor.module';
import { BlogEffects } from '../effects';
import { blogReducer } from '../reducer';
import { BlogDetailRoutingModule } from './blog-detail-routing.module';
import { BlogDetailComponent } from './blog-detail.component';

@NgModule({
    declarations: [BlogDetailComponent],
    imports: [
        CommonModule,
        BlogDetailRoutingModule,
        ReactiveFormsModule,
        MatCardModule,
        EditorModule,
        StoreModule.forFeature('blog', blogReducer),
        EffectsModule.forFeature([BlogEffects]),
    ]
})
export class BlogDetailModule { }
