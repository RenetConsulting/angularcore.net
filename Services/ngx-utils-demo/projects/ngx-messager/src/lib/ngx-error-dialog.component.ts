import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'ngx-error-dialog',
    templateUrl: './ngx-error-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxErrorDialogComponent {

    @Input() error: string;

    constructor() { }
}
