import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Self, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { enterLeaveAnimation } from '@renet-consulting/animations';
import { InputBase } from '../input.base';

@Component({
    // tslint:disable-next-line
    selector: 'ngx-mat-input',
    templateUrl: './ngx-mat-input.component.html',
    styleUrls: ['./ngx-mat-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [enterLeaveAnimation]
})
export class NgxMatInputComponent extends InputBase implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {

    @Input() autocomplete = 'off';
    @Input() name: string;
    @Input() type = 'text';

    constructor(
        @Optional() @Self() @Inject(NgControl) control: NgControl,
        @Optional() @Inject(FormGroupDirective) formGroup: FormGroupDirective,
    ) {
        super(control, formGroup);
    }
}
