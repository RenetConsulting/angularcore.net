import { Inject, Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { isString } from 'util';
import { NgxErrorDialogComponent } from './ngx-error-dialog.component';
import { NGX_DIALOG_CONFIG, NGX_SNACK_BAR_CONFIG } from './tokens';

@Injectable({
    providedIn: 'root'
})
export class NgxMessagerService {

    constructor(
        @Inject(NGX_SNACK_BAR_CONFIG) private snackBarConfig: MatSnackBarConfig,
        @Inject(NGX_DIALOG_CONFIG) private dialogConfig: MatDialogConfig,
        @Inject(MatSnackBar) private snackBar: MatSnackBar,
        @Inject(MatDialog) private dialog: MatDialog,
    ) { }

    error = (value: string | Type<any>) => {
        const component = isString(value) ? NgxErrorDialogComponent : value as Type<any>;
        const ref = this.dialog.open<NgxErrorDialogComponent>(component, this.dialogConfig);
        if (component === NgxErrorDialogComponent) {
            ref.componentInstance.error = value as string;
        }
        return ref;
    }

    success = (value: string) => this.snackBar.open(value, 'Close', this.snackBarConfig);
}
