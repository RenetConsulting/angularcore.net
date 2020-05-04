import { ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild, Directive } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { ProvidedControlValueAccessorBase } from '@renet-consulting/control-value-accessor';
import { Subscription } from 'rxjs';

@Directive()
export abstract class InputBase extends ProvidedControlValueAccessorBase implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {

    @ViewChild('inputRef', { static: true }) inputRef: ElementRef;
    @HostBinding('class') classList: string;
    @Input() class: string;
    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Input() required: boolean;
    @Input() minlength: number;
    @Input() maxlength: number;
    /** name of the field that is passed to {@link NgxValidatorDirective} */
    @Input() label: string;
    /** entry for custom errors */
    @Input() errors: Array<string>;
    @Output() readonly blur = new EventEmitter<any>();
    readonly subscription = new Subscription();
    /** an error that is provided by {@link NgxValidatorDirective} */
    error: string;
    errorState: number;
    errorsState: number;
    hintState: number;

    constructor(
        ngControl: NgControl,
        protected formGroup: FormGroupDirective,
    ) {
        super(ngControl);
    }

    ngOnChanges(e): void {
        if (e.errors) {
            this.setErrorsState();
            this.setHintState();
        }
        if (e.class) {
            this.setClass();
        }
        this.setRequired();
        this.setMaxlength();
    }

    ngOnInit(): void {
        if (this.formGroup) {
            this.subscription.add(this.formGroup.ngSubmit.subscribe(this.updateControl));
        }
        this.setError(null);
        this.setClass();
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

    setErrorState = (): void => {
        this.errorState = this.error ? 1 : 0;
    }

    setHintState = (): void => {
        this.hintState = this.showHint ? 1 : 0;
    }

    setErrorsState = (): void => {
        this.errorsState = this.errors ? this.errors.length : 0;
    }

    updateControl = (): void => {
        this.ngControl.control.markAsDirty();
        this.ngControl.control.markAsTouched();
        this.ngControl.control.updateValueAndValidity();
    }

    setRequired = (): void => {
        const validator = this.validator;
        if (!this.required && validator) {
            const errors = validator({} as AbstractControl);
            this.required = errors && errors.required;
        }
    }

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

    onBlur = () => this.blur.emit(this.ngControl.control.value);

    /** bug-fix for https://github.com/angular/angular/issues/7289 */
    setClass = () => this.classList = ['d-block', this.class].filter(x => !!x).join(' ');
}
