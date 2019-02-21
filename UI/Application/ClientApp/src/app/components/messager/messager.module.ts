import { CommonModule } from '@angular/common';
import { NgModule, Provider } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { SNACK_BAR_MESSAGER_CONFIG } from '../../consts/snack-bar-messager.config';
import { ErrorMessageDialogModule } from '../../dialogs/error-message-dialog/error-message-dialog.module';
import { MessagerComponent } from './messager.component';

const MODULES = [
    CommonModule,
    MatSnackBarModule,
    ErrorMessageDialogModule,
    MatDialogModule
];

const PROVIDERS: Array<Provider> = [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: SNACK_BAR_MESSAGER_CONFIG }
];

const COMPONENTS = [
    MessagerComponent
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
    providers: [
        ...PROVIDERS
    ]
})
export class MessagerModule { }