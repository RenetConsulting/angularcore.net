import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'ngx-error-dialog',
    templateUrl: './ngx-error-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxErrorDialogComponent {

    readonly error = new BehaviorSubject('');

    constructor() { }

    setError = (e: string) => this.error.next(e);
}
