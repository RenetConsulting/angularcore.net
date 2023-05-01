import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomErrorDialogComponent } from './custom-error-dialog.component';

@NgModule({
    declarations: [CustomErrorDialogComponent],
    exports: [CustomErrorDialogComponent],
    imports: [
        CommonModule,
        MatDialogModule
    ]
})
export class CustomErrorDialogModule { }
