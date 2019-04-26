import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
//import { NgxMatInputModule } from 'ngx-mat-input';
import { NgxMatInputModule } from 'projects/ngx-mat-input/src/public-api';
import { InputRoutingModule } from './input-routing.module';
import { InputComponent } from './input.component';

@NgModule({
    declarations: [InputComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputRoutingModule,
        NgxMatInputModule
    ]
})
export class InputModule { }
