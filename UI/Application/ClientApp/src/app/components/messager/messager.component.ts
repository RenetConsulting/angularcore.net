import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IError } from '../../interfaces/error';
import { RootStore } from '../../reducers';
import { DIALOG_CONFIG } from './dialog.config';
import { ErrorMessageDialogComponent } from './error-message-dialog/error-message-dialog.component';
import { selectError, selectMessage } from './selectors';
import { SNACK_BAR_CONFIG } from './snack-bar.config';

@Component({
    selector: 'messager',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagerComponent implements OnInit, OnDestroy {

    readonly subscription = new Subscription();

    constructor(
        @Inject(MatSnackBar) private matSnackBar: MatSnackBar,
        @Inject(MatDialog) private matDialog: MatDialog,
        @Inject(Store) private store: Store<RootStore>,
    ) { }

    ngOnInit() {
        this.subscription.add(this.store.select(selectError).subscribe(this.openDialog));
        this.subscription.add(this.store.select(selectMessage).subscribe(this.openSnackBar));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    openDialog = (value: IError): void => {
        if (value) {
            const ref = this.matDialog.open(ErrorMessageDialogComponent, DIALOG_CONFIG);
            ref.componentInstance.item = value;
        }
    }

    openSnackBar = (value: string) => value && this.matSnackBar.open(value, 'Close', SNACK_BAR_CONFIG);
}