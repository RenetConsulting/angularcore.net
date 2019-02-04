import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnDestroy, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subscription } from 'rxjs';

@Component({
    selector: 'control-input',
    templateUrl: './control.input.component.html',
    styleUrls: ['./control.input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlInputComponent implements ControlValueAccessor, OnInit, OnDestroy {

    @ViewChild("inputRef") _inputRef: ElementRef;
    @ViewChild(MatFormFieldControl) fieldControl: MatFormFieldControl<any>;
    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Input() type: string = "text";
    @Input() required: boolean;
    @Input() minlength: number;
    @Input() maxlength: number;
    readonly subscription = new Subscription();
    disabled: boolean;
    onChange: Function;
    onTouched: Function;
    value: any;

    constructor(
        @Optional() @Self() @Inject(NgControl) readonly ngControl: NgControl,
        @Optional() @Inject(FormGroupDirective) private readonly _parentFormGroup: FormGroupDirective,
    ) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngOnInit(): void {
        this.subscription.add(this._parentFormGroup.ngSubmit.subscribe(() => this.ngControl.control.updateValueAndValidity()))
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    writeValue(value): void {
        this.value = value;
        this.onChange && this.onChange(value);
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
