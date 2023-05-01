import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxErrorDialogComponent } from './ngx-error-dialog.component';
import { NgxMessengerService } from './ngx-messenger.service';

@NgModule({
    declarations: [NgxErrorDialogComponent],
    exports: [NgxErrorDialogComponent],
    providers: [
        NgxMessengerService
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatSnackBarModule,
        MatButtonModule
    ]
})
export class NgxMessengerModule { }
