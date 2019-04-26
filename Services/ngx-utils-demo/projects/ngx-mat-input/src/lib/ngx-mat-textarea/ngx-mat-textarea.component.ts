import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Self, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { errorEnterLeaveAnimation, hintEnterLeaveAnimation } from '../animations';
import { NgxMatInputBase } from '../ngx-mat-input.base';

/** TODO: create unit tests */
@Component({
    // tslint:disable-next-line
    selector: 'ngx-mat-textarea',
    templateUrl: './ngx-mat-textarea.component.html',
    styleUrls: ['./ngx-mat-textarea.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [errorEnterLeaveAnimation, hintEnterLeaveAnimation]
})
export class NgxMatTextareaComponent extends NgxMatInputBase implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {

    @Input() minRows = 7;

    constructor(
        @Optional() @Self() @Inject(NgControl) ngControl: NgControl,
        @Optional() @Inject(FormGroupDirective) formGroup: FormGroupDirective,
    ) {
        super(ngControl, formGroup);
    }
}
