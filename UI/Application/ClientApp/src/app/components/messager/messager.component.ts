import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ERROR_MESSAGE_DIALOG_CONFIG } from '../../consts/error-message-dialog.config';
import { ErrorMessageDialogComponent } from '../../dialogs/error-message-dialog/error-message-dialog.component';
import { IError } from '../../interfaces/error';
import { MessageHandlerService } from '../../services/message-handler/message-handler.service';

@Component({
    selector: 'messager',
    template: ''
})
export class MessagerComponent implements OnInit, OnDestroy {

    readonly subscription = new Subscription();

    constructor(
        @Inject(MessageHandlerService) private messageHandlerService: MessageHandlerService,
        @Inject(MatSnackBar) private matSnackBar: MatSnackBar,
        @Inject(MatDialog) private matDialog: MatDialog
    ) { }

    ngOnInit() {
        this.subscription.add(this.messageHandlerService.errorSubject.subscribe(this.openDialog));
        this.subscription.add(this.messageHandlerService.successSubject.subscribe(this.openSnackBar));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    openDialog = (value: IError): void => {
        const ref = this.matDialog.open(ErrorMessageDialogComponent, ERROR_MESSAGE_DIALOG_CONFIG);
        ref.componentInstance.item = value;
    }

    openSnackBar = (value: string) => this.matSnackBar.open(value, 'Close');
}