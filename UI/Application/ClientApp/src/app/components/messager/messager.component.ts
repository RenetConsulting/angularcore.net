import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ErrorMessageDialogComponent } from '../../dialogs/error.message/error.message.dialog.component';
import { MessageHandlerService } from '../../services/message.handler/message.handler.service';

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

    openDialog = (value: string): void => {
        const ref = this.matDialog.open(ErrorMessageDialogComponent, { panelClass: 'error-message-dialog' });
        ref.componentInstance.message = value;
    }

    openSnackBar = (value: string) => this.matSnackBar.open(value, 'Close');
}