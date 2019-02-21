import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IError } from '../../interfaces/error';

@Component({
    selector: 'error-message-dialog',
    templateUrl: './error.message.dialog.component.html',
    styleUrls: ['./error.message.dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorMessageDialogComponent {

    @Input() item: IError;

    constructor() { }
}