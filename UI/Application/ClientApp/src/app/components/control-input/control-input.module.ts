import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ValidatorModule } from '~/directives/validator/validator.module';
import { ControlInputComponent } from './control-input.component';

@NgModule({
    declarations: [ControlInputComponent],
    exports: [ControlInputComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        ValidatorModule,
    ],
})
export class ControlInputModule { }
