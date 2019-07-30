import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CloseDialogDirective } from './close-dialog.directive';

@NgModule({
    declarations: [CloseDialogDirective],
    exports: [CloseDialogDirective],
    imports: [
        CommonModule,
        MatDialogModule
    ]
})
export class CloseDialogModule { }
