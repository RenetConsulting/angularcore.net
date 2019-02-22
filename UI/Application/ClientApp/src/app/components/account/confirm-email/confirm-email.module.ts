import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { ControlInputModule } from '../../control-input/control-input.module';
import { ConfirmEmailRoutingModule } from './confirm-email-routing.module';
import { ConfirmEmailComponent } from './confirm-email.component';
import { ConfirmEmailEffects } from './effects';

const MODULES = [
    CommonModule,
    ConfirmEmailRoutingModule,
    ReactiveFormsModule,
    ControlInputModule,
    EffectsModule.forRoot([ConfirmEmailEffects]),
];

const COMPONENTS = [
    ConfirmEmailComponent
];

@NgModule({
    imports: [
        ...MODULES
    ],
    declarations: [
        ...COMPONENTS
    ]
})
export class ConfirmEmailModule { }
