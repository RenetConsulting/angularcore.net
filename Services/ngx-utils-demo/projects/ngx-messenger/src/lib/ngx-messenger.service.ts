import { ComponentType } from '@angular/cdk/portal';
import { Inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { isString } from '@renet-consulting/util';
import { NgxErrorDialogComponent } from './ngx-error-dialog.component';
import { NGX_DIALOG_CONFIG, NGX_SNACK_BAR_CONFIG } from './tokens';

@Injectable({
    providedIn: 'root'
})
export class NgxMessengerService {

    constructor(
        @Inject(NGX_SNACK_BAR_CONFIG) private snackBarConfig: MatSnackBarConfig,
        @Inject(NGX_DIALOG_CONFIG) private dialogConfig: MatDialogConfig,
        @Inject(MatSnackBar) private snackBar: MatSnackBar,
        @Inject(MatDialog) private dialog: MatDialog,
    ) { }

    error = <T = any>(value: string | ComponentType<T>) => {
        const component: ComponentType<any> = isString(value) ? NgxErrorDialogComponent : value as ComponentType<T>;
        const ref = this.dialog.open(component, this.dialogConfig);
        if (component === NgxErrorDialogComponent) {
            (ref.componentInstance as NgxErrorDialogComponent).error = value as string;
        }
        return ref as MatDialogRef<T>;
    }

    success = (value: string) => this.snackBar.open(value, 'Close', this.snackBarConfig);
}
