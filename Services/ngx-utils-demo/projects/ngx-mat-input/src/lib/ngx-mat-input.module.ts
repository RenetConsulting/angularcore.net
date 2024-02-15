import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgxValidatorModule } from '@renet-consulting/ngx-validator';
import { NgxMatInputComponent } from './ngx-mat-input/ngx-mat-input.component';
import { NgxMatTextareaComponent } from './ngx-mat-textarea/ngx-mat-textarea.component';

@NgModule({
    declarations: [NgxMatInputComponent, NgxMatTextareaComponent],
    exports: [NgxMatInputComponent, NgxMatTextareaComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        NgxValidatorModule,
    ],
})
export class NgxMatInputModule { }
