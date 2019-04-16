import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { EditorComponent } from './editor.component';

@NgModule({
    declarations: [EditorComponent],
    exports: [EditorComponent],
    imports: [
        CommonModule,
        QuillModule,
        ReactiveFormsModule
    ]
})
export class EditorModule { }
