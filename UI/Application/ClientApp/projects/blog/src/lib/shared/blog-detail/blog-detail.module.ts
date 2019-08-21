import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxMatInputModule } from '@renet-consulting/ngx-mat-input';
import { EditorModule } from '../../core/components/editor/editor.module';
import { PromptDialogModule } from '../../core/components/prompt-dialog/prompt-dialog.module';
import { blogReducer } from '../../core/reducer';
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
        EditorModule,
        StoreModule.forFeature('blog', blogReducer),
        EffectsModule.forFeature([BlogDetailEffects]),
        PromptDialogModule
    ]
})
export class BlogDetailModule { }
