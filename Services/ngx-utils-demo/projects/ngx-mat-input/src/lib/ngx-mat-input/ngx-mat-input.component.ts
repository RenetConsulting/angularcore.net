import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Self, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { errorEnterLeaveAnimation, hintEnterLeaveAnimation } from '../animations';
import { NgxMatInputBase } from '../ngx-mat-input.base';

@Component({
    // tslint:disable-next-line
    selector: 'ngx-mat-input',
    templateUrl: './ngx-mat-input.component.html',
    styleUrls: ['./ngx-mat-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [errorEnterLeaveAnimation, hintEnterLeaveAnimation]
})
export class NgxMatInputComponent extends NgxMatInputBase implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {

    @Input() autocomplete: 'on' | 'off' = 'off';
    @Input() type = 'text';

    constructor(
        @Optional() @Self() @Inject(NgControl) ngControl: NgControl,
        @Optional() @Inject(FormGroupDirective) formGroup: FormGroupDirective,
    ) {
        super(ngControl, formGroup);
    }
}
