import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskModule } from 'ngx-mask';
import { ValidatorModule } from '../../directives/validator/validator.module';
import { ControlInputComponent } from './control-input.component';

const MODULES = [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    ValidatorModule,
];

const COMPONENTS = [
    ControlInputComponent
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [...MODULES, NgxMaskModule.forRoot()],
    exports: [...COMPONENTS],
})
export class ControlInputModule { }
