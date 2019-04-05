import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MessagerEffects } from './effects';
import { ErrorMessageDialogModule } from './error-message-dialog/error-message-dialog.module';
import { MessagerComponent } from './messager.component';
import { messagerReducer } from './reducer';

@NgModule({
    declarations: [MessagerComponent],
    exports: [MessagerComponent],
    imports: [
        CommonModule,
        MatSnackBarModule,
        ErrorMessageDialogModule,
        MatDialogModule,
        StoreModule.forFeature('messager', messagerReducer),
        EffectsModule.forFeature([MessagerEffects]),
    ],
})
export class MessagerModule { }