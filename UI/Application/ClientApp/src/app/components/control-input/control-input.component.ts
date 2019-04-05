import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Self, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { EnterLeaveAnimation } from '../../animations/enter-leave.animation';

@Component({
    selector: 'control-input',
    templateUrl: './control-input.component.html',
    styleUrls: ['./control-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [EnterLeaveAnimation]
})
export class ControlInputComponent implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {

    @ViewChild(MatFormFieldControl) fieldControl: MatFormFieldControl<any>;
    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Input() type = 'text';
    @Input() required: boolean;
    @Input() minlength: number;
    @Input() maxlength: number;
    /** custom error messages */
    @Input() errorMessages: Array<string>;
    readonly subscription = new Subscription();
    disabled: boolean;
    onChange: (i) => any | null;
    onTouched;
    value;
    /** {@link NgControl} error message */
    matError: string;
    messagesAnimationState: number;
    matErrorAnimationState: number;
    matHintAnimationState: number;

    constructor(
        @Optional() @Self() @Inject(NgControl) public ngControl: NgControl,
        @Optional() @Inject(FormGroupDirective) private parentFormGroup: FormGroupDirective,
    ) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngOnChanges(e) {
        if (e.errorMessages) {
            this.messagesAnimationState = this.errorMessages ? this.errorMessages.length : 0;
        }
    }

    ngOnInit(): void {
        this.subscription.add(this.parentFormGroup.ngSubmit.subscribe(() => {
            this.ngControl.control.markAsDirty();
            this.ngControl.control.markAsTouched();
            this.ngControl.control.updateValueAndValidity();
        }));
        this.setError(null);
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

    setError = (value: string): void => {
        this.matErrorAnimationState = value ? 1 : 0;
        this.matHintAnimationState = !value ? 1 : 0;
        this.matError = value;
    }
}