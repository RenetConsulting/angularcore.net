import { ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ControlValueAccessorBase } from './control-value-accessor.base';

export abstract class InputBase extends ControlValueAccessorBase implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {

    @ViewChild('inputRef') inputRef: ElementRef;
    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Input() required: boolean;
    @Input() minlength: number;
    @Input() maxlength: number;
    /** name of the field that is passed to {@link NgxValidatorDirective} */
    @Input() label: string;
    /** entry for custom errors */
    @Input() errors: Array<string>;
    readonly subscription = new Subscription();
    /** an error that is provided by {@link NgxValidatorDirective} */
    error: string;
    errorState: number;
    errorsState: number;
    hintState: number;

    constructor(
        control: NgControl,
        protected formGroup: FormGroupDirective,
    ) {
        super(control);
    }

    ngOnChanges(e): void {
        if (e.errors) {
            this.setErrorsState();
            this.setHintState();
        }
        this.setRequired();
        this.setMaxlength();
    }

    ngOnInit(): void {
        if (this.formGroup) {
            this.subscription.add(this.formGroup.ngSubmit.subscribe(this.updateControl));
        }
        this.setError(null);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    get showHint() {
        return !this.error && (Array.isArray(this.errors) && this.errors.length === 0 || !this.errors);
    }

    get validator() {
        return this.ngControl && this.ngControl.control && this.ngControl.control.validator;
    }

    /** internal */
    setErrorState = (): void => {
        this.errorState = this.error ? 1 : 0;
    }

    /** internal */
    setHintState = (): void => {
        this.hintState = this.showHint ? 1 : 0;
    }

    /** internal */
    setErrorsState = (): void => {
        this.errorsState = this.errors ? this.errors.length : 0;
    }

    /** internal */
    updateControl = (): void => {
        this.ngControl.control.markAsDirty();
        this.ngControl.control.markAsTouched();
        this.ngControl.control.updateValueAndValidity();
    }

    /** internal */
    setRequired = (): void => {
        const validator = this.validator;
        if (!this.required && validator) {
            const errors = validator({} as AbstractControl);
            this.required = errors && errors.required;
        }
    }

    /** internal */
    setMaxlength = (): void => {
        const validator = this.validator;
        if (!this.maxlength && validator) {
            const value: ArrayLike<any> = { length: Infinity };
            const errors = validator({ value } as AbstractControl);
            this.maxlength = errors && errors.maxlength && errors.maxlength.requiredLength;
        }
    }

    setError = (value: string): void => {
        this.error = value;
        this.setErrorState();
        this.setHintState();
    }
}
