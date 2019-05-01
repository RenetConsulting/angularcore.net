import { InjectionToken } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBarConfig } from '@angular/material/snack-bar';

export const NGX_SNACK_BAR_CONFIG = new InjectionToken<MatSnackBarConfig>('NGX_SNACK_BAR_CONFIG', {
    providedIn: 'root',
    factory: () => ({
        duration: 10000,
        direction: 'ltr',
        horizontalPosition: 'end',
        verticalPosition: 'top'
    })
});

export const NGX_DIALOG_CONFIG = new InjectionToken<MatDialogConfig>('NGX_DIALOG_CONFIG', {
    providedIn: 'root',
    factory: () => ({
        maxWidth: 600,
        minWidth: 300,
        position: { top: '15px' },
        panelClass: 'error-message-dialog'
    })
});
