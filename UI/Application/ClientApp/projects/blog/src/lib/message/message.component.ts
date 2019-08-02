import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Component({
    selector: 'lib-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent {

    @Output() readonly change = new EventEmitter<boolean>();
    readonly content = new Subject<string>();

    constructor(
        @Inject(MatSnackBar) private snackBar: MatSnackBar,
    ) { }

    setContent = (x: string) => this.content.next(x);

    success = (): void => {
        this.change.emit(true);
        this.snackBar.dismiss();
    }

    close = (): void => {
        this.change.emit(false);
        this.snackBar.dismiss();
    }
}
