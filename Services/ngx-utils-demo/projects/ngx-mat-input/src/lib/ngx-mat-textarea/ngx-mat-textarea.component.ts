import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Self, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { errorEnterLeaveAnimation, hintEnterLeaveAnimation } from '../animations';
import { InputBase } from '../input.base';
import { NGX_MAX_ROWS_TEXTAREA } from '../max-rows-textarea';
import { NGX_MIN_ROWS_TEXTAREA } from '../min-rows-textarea';

@Component({
    // tslint:disable-next-line
    selector: 'ngx-mat-textarea',
    templateUrl: './ngx-mat-textarea.component.html',
    styleUrls: ['./ngx-mat-textarea.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [errorEnterLeaveAnimation, hintEnterLeaveAnimation]
})
export class NgxMatTextareaComponent extends InputBase implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {

    constructor(
        @Optional() @Self() @Inject(NgControl) control: NgControl,
        @Optional() @Inject(FormGroupDirective) formGroup: FormGroupDirective,
        @Input() @Optional() @Inject(NGX_MIN_ROWS_TEXTAREA) public minRows: number,
        @Input() @Optional() @Inject(NGX_MAX_ROWS_TEXTAREA) public maxRows: number,
    ) {
        super(control, formGroup);
    }
}
