import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { ErrorMessageDialogComponent } from './error-message-dialog.component';
import { ResendConfirmationModule } from './resend-confirmation/resend-confirmation.module';

@NgModule({
    declarations: [ErrorMessageDialogComponent],
    exports: [ErrorMessageDialogComponent],
    entryComponents: [ErrorMessageDialogComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        RouterModule,
        ResendConfirmationModule,
    ],
})
export class ErrorMessageDialogModule { }
