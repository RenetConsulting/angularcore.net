import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxMatInputModule } from '@renet-consulting/ngx-mat-input';
import { EditorModule } from '../editor/editor.module';
import { blogReducer } from '../reducer';
import { BlogDashboardRoutingModule } from './blog-dashboard-routing.module';
import { BlogDashboardComponent } from './blog-dashboard.component';
import { BlogDashboardEffects } from './effects';

@NgModule({
    declarations: [BlogDashboardComponent],
    imports: [
        CommonModule,
        BlogDashboardRoutingModule,
        ReactiveFormsModule,
        MatCardModule,
        NgxMatInputModule,
        MatButtonModule,
        EditorModule,
        StoreModule.forFeature('blog', blogReducer),
        EffectsModule.forFeature([BlogDashboardEffects]),
    ]
})
export class BlogDashboardModule { }
