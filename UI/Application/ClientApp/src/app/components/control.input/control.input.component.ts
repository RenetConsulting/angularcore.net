import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { enterLeaveHOW } from '../../animations/enter.leave.how';

@Component({
    selector: 'control-input',
    templateUrl: './control.input.component.html',
    styleUrls: ['./control.input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [enterLeaveHOW]
})
export class ControlInputComponent implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {

    @ViewChild('inputRef') _inputRef: ElementRef;
    @ViewChild(MatFormFieldControl) fieldControl: MatFormFieldControl<any>;
    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Input() type = 'text';
    @Input() required: boolean;
    @Input() minlength: number;
    @Input() maxlength: number;
    @Input() errorMessages: Array<string>;
    readonly subscription = new Subscription();
    transition: number;
    disabled: boolean;
    onChange: (i) => any | null;
    onTouched;
    value;

    constructor(
        @Optional() @Self() @Inject(NgControl) readonly ngControl: NgControl,
        @Optional() @Inject(FormGroupDirective) private readonly _parentFormGroup: FormGroupDirective,
    ) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngOnChanges(e) {
        if (e.errorMessages) {
            this.transition = this.errorMessages ? this.errorMessages.length : 0;
        }
    }

    ngOnInit(): void {
        this.subscription.add(this._parentFormGroup.ngSubmit.subscribe(() => this.ngControl.control.updateValueAndValidity()));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    writeValue(value): void {
        this.value = value;
        if (this.onChange) {
            this.onChange(value);
        }
    }

    registerOnChange(fn): void {
        this.onChange = fn;
    }

    registerOnTouched(fn): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
