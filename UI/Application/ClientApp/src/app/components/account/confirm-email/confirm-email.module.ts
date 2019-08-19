import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EffectsModule } from '@ngrx/effects';
import { NgxMatInputModule } from '@renet-consulting/ngx-mat-input';
import { ConfirmEmailRoutingModule } from './confirm-email-routing.module';
import { ConfirmEmailComponent } from './confirm-email.component';
import { ConfirmEmailEffects } from './effects';

@NgModule({
    declarations: [ConfirmEmailComponent],
    imports: [
        CommonModule,
        ConfirmEmailRoutingModule,
        ReactiveFormsModule,
        NgxMatInputModule,
        MatButtonModule,
        MatCardModule,
        EffectsModule.forFeature([ConfirmEmailEffects]),
    ],
})
export class ConfirmEmailModule { }
