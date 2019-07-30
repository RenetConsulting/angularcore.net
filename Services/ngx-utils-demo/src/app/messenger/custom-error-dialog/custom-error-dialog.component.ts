import { Component } from '@angular/core';
import { IErrorDialog } from 'projects/ngx-messenger/src/lib/error-dialog';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-custom-error-dialog',
    templateUrl: './custom-error-dialog.component.html',
    styleUrls: ['./custom-error-dialog.component.css']
})
export class CustomErrorDialogComponent implements IErrorDialog {

    readonly error = new BehaviorSubject<string>('');

    constructor() { }

    setError = (e: string) => this.error.next(e);
}
