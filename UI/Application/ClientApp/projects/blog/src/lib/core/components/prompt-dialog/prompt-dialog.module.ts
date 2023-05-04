import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { PromptDialogComponent } from './prompt-dialog.component';

@NgModule({
    declarations: [PromptDialogComponent],
    exports: [PromptDialogComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule
    ]
})
export class PromptDialogModule { }
