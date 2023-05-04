import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MessageDialogComponent } from './message-dialog.component';

@NgModule({
    declarations: [MessageDialogComponent],
    exports: [MessageDialogComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatSnackBarModule
    ]
})
export class MessageDialogModule { }
