import { ChangeDetectionStrategy, Component, Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IErrorDialog } from './error-dialog';
import { NgxDefaultSecurityService } from './ngx-default-security.service';

@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'ngx-error-dialog',
    templateUrl: './ngx-error-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxErrorDialogComponent implements IErrorDialog {

    readonly error = new BehaviorSubject<string>('');

    constructor(
        @Inject(NgxDefaultSecurityService) private security: NgxDefaultSecurityService
    ) { }

    setError = (e: string) => this.error.next(this.security.map(e));
}
