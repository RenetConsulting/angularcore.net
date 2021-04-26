import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Self, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { enterLeaveAnimation } from '@renet-consulting/animations';
import { InputBaseDirective } from '../input.base';
import { NGX_MAX_ROWS_TEXTAREA } from '../max-rows-textarea';
import { NGX_MIN_ROWS_TEXTAREA } from '../min-rows-textarea';

@Component({
    // tslint:disable-next-line
    selector: 'ngx-mat-textarea',
    templateUrl: './ngx-mat-textarea.component.html',
    styleUrls: ['./ngx-mat-textarea.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [enterLeaveAnimation]
})
export class NgxMatTextareaComponent extends InputBaseDirective implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {

    @Input() minRows: number;
    @Input() maxRows: number;

    constructor(
        @Optional() @Self() @Inject(NgControl) control: NgControl,
        @Optional() @Inject(FormGroupDirective) formGroup: FormGroupDirective,
        @Optional() @Inject(NGX_MIN_ROWS_TEXTAREA) minRows: number,
        @Optional() @Inject(NGX_MAX_ROWS_TEXTAREA) maxRows: number,
    ) {
        super(control, formGroup);

        this.minRows = minRows;
        this.maxRows = maxRows;
    }
}
