import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgxMatInputModule } from 'projects/ngx-mat-input/src/public-api';
import { InputRoutingModule } from './input-routing.module';
import { InputComponent } from './input.component';

@NgModule({
    declarations: [InputComponent],
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } as MatFormFieldDefaultOptions }
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputRoutingModule,
        NgxMatInputModule
    ]
})
export class InputModule { }
