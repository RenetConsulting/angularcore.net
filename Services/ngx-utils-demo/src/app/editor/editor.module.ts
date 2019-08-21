import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { EditorModule as Editor } from 'projects/editor/src/public-api';
import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component';

@NgModule({
    declarations: [EditorComponent],
    imports: [
        CommonModule,
        EditorRoutingModule,
        ReactiveFormsModule,
        Editor,
        MatCardModule
    ]
})
export class EditorModule { }
