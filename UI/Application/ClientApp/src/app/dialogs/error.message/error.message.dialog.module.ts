import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ErrorMessageDialogComponent } from './error.message.dialog.component';

const MODULES = [
    CommonModule,
    MatDialogModule,
    MatButtonModule
];

const COMPONENTS = [
    ErrorMessageDialogComponent
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
    ],
    entryComponents: [
        ...COMPONENTS
    ]
})
export class ErrorMessageDialogModule { }