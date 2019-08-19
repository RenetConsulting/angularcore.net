import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
// import { NgxMatInputModule } from 'ngx-mat-input';
import { NgxMatInputModule } from 'projects/ngx-mat-input/src/public-api';
import { ResizeModule } from 'projects/resize/src/public-api';
import { InputRoutingModule } from './input-routing.module';
import { InputComponent } from './input.component';

@NgModule({
    declarations: [InputComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputRoutingModule,
        NgxMatInputModule,
        ResizeModule,
        MatCardModule
    ]
})
export class InputModule { }
