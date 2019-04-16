import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { EditorModule } from '../editor/editor.module';
import { BlogEffects } from '../effects';
import { blogReducer } from '../reducer';
import { BlogDashboardRoutingModule } from './blog-dashboard-routing.module';
import { BlogDashboardComponent } from './blog-dashboard.component';

@NgModule({
    declarations: [BlogDashboardComponent],
    imports: [
        CommonModule,
        BlogDashboardRoutingModule,
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        EditorModule,
        StoreModule.forFeature('blog', blogReducer),
        EffectsModule.forFeature([BlogEffects]),
    ]
})
export class BlogDashboardModule { }
