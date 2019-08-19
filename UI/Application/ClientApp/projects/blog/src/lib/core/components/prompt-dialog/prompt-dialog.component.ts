import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'lib-prompt-dialog',
    templateUrl: './prompt-dialog.component.html',
    styleUrls: ['./prompt-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromptDialogComponent {

    readonly content = new BehaviorSubject<string>('');

    constructor() { }

    setContent = (x: string) => this.content.next(x);
}
