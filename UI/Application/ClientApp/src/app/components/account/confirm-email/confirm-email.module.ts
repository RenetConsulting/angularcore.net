import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EffectsModule } from '@ngrx/effects';
import { ControlInputModule } from '~/components/control-input/control-input.module';
import { ConfirmEmailRoutingModule } from './confirm-email-routing.module';
import { ConfirmEmailComponent } from './confirm-email.component';
import { ConfirmEmailEffects } from './effects';

@NgModule({
    declarations: [ConfirmEmailComponent],
    imports: [
        CommonModule,
        ConfirmEmailRoutingModule,
        ReactiveFormsModule,
        ControlInputModule,
        MatButtonModule,
        MatCardModule,
        EffectsModule.forRoot([ConfirmEmailEffects]),
    ],
})
export class ConfirmEmailModule { }
