import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxErrorDialogComponent } from './ngx-error-dialog.component';
import { NgxMessagerService } from './ngx-messager.service';

@NgModule({
    declarations: [NgxErrorDialogComponent],
    exports: [NgxErrorDialogComponent],
    entryComponents: [NgxErrorDialogComponent],
    providers: [
        NgxMessagerService
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatSnackBarModule,
        MatButtonModule
    ],
})
export class NgxMessagerModule { }
