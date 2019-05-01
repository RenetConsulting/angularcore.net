import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, ViewRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'lib-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent {

    @Output() change = new EventEmitter<boolean>();
    private _subject;

    constructor(
        @Inject(MatSnackBar) private snackBar: MatSnackBar,
        @Inject(ChangeDetectorRef) private viewRef: ViewRef,
    ) { }

    get subject() {
        return this._subject;
    }

    @Input() set subject(value) {
        this._subject = value;
        !this.viewRef.destroyed && this.viewRef.detectChanges();
    }

    success = (): void => {
        this.snackBar.dismiss();
        this.change.emit(true);
    }

    close = (): void => {
        this.snackBar.dismiss();
        this.change.emit(false);
    }
}
