import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxValidatorModule } from 'projects/ngx-validator/src/public-api';
import { ValidatorRoutingModule } from './validator-routing.module';
import { ValidatorComponent } from './validator.component';

@NgModule({
    declarations: [ValidatorComponent],
    imports: [
        CommonModule,
        ValidatorRoutingModule,
        NgxValidatorModule,
        ReactiveFormsModule,
    ]
})
export class ValidatorModule { }
