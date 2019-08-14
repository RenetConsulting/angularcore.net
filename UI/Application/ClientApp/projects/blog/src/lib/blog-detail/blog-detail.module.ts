import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxMatInputModule } from '@renet-consulting/ngx-mat-input';
import { EditorToolbarModule } from '../editor-toolbar/editor-toolbar.module';
import { blogReducer } from '../reducer';
import { BlogDetailRoutingModule } from './blog-detail-routing.module';
import { BlogDetailComponent } from './blog-detail.component';
import { BlogDetailEffects } from './effects';

@NgModule({
    declarations: [BlogDetailComponent],
    imports: [
        CommonModule,
        BlogDetailRoutingModule,
        ReactiveFormsModule,
        MatCardModule,
        NgxMatInputModule,
        MatButtonModule,
        MatDialogModule,
        EditorToolbarModule,
        StoreModule.forFeature('blog', blogReducer),
        EffectsModule.forFeature([BlogDetailEffects]),
    ]
})
export class BlogDetailModule { }
