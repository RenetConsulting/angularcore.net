import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgxValidatorModule } from '@renet-consulting/ngx-validator';
import { NgxMatInputComponent } from './ngx-mat-input.component';

@NgModule({
    declarations: [NgxMatInputComponent],
    exports: [NgxMatInputComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        NgxValidatorModule,
    ],
})
export class NgxMatInputModule { }
