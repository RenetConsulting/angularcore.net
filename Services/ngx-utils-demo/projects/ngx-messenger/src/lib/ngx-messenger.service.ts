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

    /** a constructor of error component */
    cnstr: ComponentType<any>;

    constructor(
        @Inject(NGX_SNACK_BAR_CONFIG) private snackBarConfig: MatSnackBarConfig,
        @Inject(NGX_DIALOG_CONFIG) private dialogConfig: MatDialogConfig,
        @Inject(MatSnackBar) private snackBar: MatSnackBar,
        @Inject(MatDialog) private dialog: MatDialog,
        @Inject(NgxErrorDialogComponent) errorComponent: NgxErrorDialogComponent
    ) {
        this.cnstr = errorComponent.constructor as ComponentType<any>;
    }

    error = <T = any>(value: string | ComponentType<T>) => {
        const component = isString(value) ? this.cnstr : value;
        const ref = this.dialog.open(component as ComponentType<any>, this.dialogConfig);
        if (component === this.cnstr) {
            (ref.componentInstance as NgxErrorDialogComponent).setError(value as string);
        }
        return ref as MatDialogRef<T>;
    }

    success = (value: string) => this.snackBar.open(value, 'Close', this.snackBarConfig);
}
