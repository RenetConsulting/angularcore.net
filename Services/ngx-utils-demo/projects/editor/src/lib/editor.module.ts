import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { EditorComponent } from './editor.component';
import { ValidatorDirective } from './validator.directive';

@NgModule({
    declarations: [EditorComponent, ValidatorDirective],
    exports: [EditorComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        QuillModule.forRoot(),
    ]
})
export class EditorModule { }
