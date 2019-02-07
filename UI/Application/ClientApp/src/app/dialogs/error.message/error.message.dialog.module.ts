import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ErrorMessageDialogComponent } from './error.message.dialog.component';

const MODULES = [
    CommonModule,
    MatDialogModule
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