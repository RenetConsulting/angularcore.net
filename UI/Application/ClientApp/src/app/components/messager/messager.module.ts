import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EffectsModule } from '@ngrx/effects';
import { MessagerEffects } from './effects';
import { ErrorMessageDialogModule } from './error-message-dialog/error-message-dialog.module';
import { MessagerComponent } from './messager.component';

const MODULES = [
    CommonModule,
    MatSnackBarModule,
    ErrorMessageDialogModule,
    MatDialogModule,
    EffectsModule.forFeature([MessagerEffects])
];

const COMPONENTS = [
    MessagerComponent
];

@NgModule({
    imports: [
        ...MODULES
    ],
    exports: [
        ...COMPONENTS
    ],
    declarations: [
        ...COMPONENTS
    ]
})
export class MessagerModule { }