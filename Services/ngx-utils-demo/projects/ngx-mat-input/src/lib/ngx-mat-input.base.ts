import { Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { Subscription } from 'rxjs';

export abstract class NgxMatInputBase implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {

    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Input() required: boolean;
    @Input() minlength: number;
    @Input() maxlength: number;
    /** name of the field that is passed to {@link NgxValidatorDirective} */
    @Input() label: number;
    /** entry for custom errors */
    @Input() errors: Array<string>;
    @Input() appearance: MatFormFieldAppearance;
    readonly subscription = new Subscription();
    disabled: boolean;
    onChange: (x) => any | null;
    onTouched: () => void;
    value;
    /** an error that is provided by {@link NgxValidatorDirective} */
    error: string;
    errorState: number;
    errorsState: number;
    hintState: number;

    constructor(
        public ngControl: NgControl,
        private formGroup: FormGroupDirective,
    ) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
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

    /** internal */
    writeValue(value): void {
        this.value = value;
        if (this.onChange) {
            this.onChange(value);
        }
    }

    /** internal */
    registerOnChange(fn): void {
        this.onChange = fn;
    }

    /** internal */
    registerOnTouched(fn): void {
        this.onTouched = fn;
    }

    /** internal */
    setDisabledState(value: boolean): void {
        this.disabled = value;
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
        if (!this.required && this.ngControl) {
            const errors = this.ngControl.control.validator({} as AbstractControl);
            this.required = errors && errors.required;
        }
    }

    /** internal */
    setMaxlength = (): void => {
        if (!this.maxlength && this.ngControl) {
            const value: ArrayLike<any> = { length: Infinity };
            const errors = this.ngControl.control.validator({ value } as AbstractControl);
            this.maxlength = errors && errors.maxlength && errors.maxlength.requiredLength;
        }
    }

    setError = (value: string): void => {
        this.error = value;
        this.setErrorState();
        this.setHintState();
    }
}
