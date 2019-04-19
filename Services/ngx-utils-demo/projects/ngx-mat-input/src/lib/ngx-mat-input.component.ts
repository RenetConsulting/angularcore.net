import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Self, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { errorEnterLeaveAnimation, hintEnterLeaveAnimation } from './animations';

/** TODO: create unit tests */
@Component({
    selector: 'ngx-mat-input',
    templateUrl: './ngx-mat-input.component.html',
    styleUrls: ['./ngx-mat-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [errorEnterLeaveAnimation, hintEnterLeaveAnimation]
})
export class NgxMatInputComponent implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {

    @Input() autocomplete: 'on' | 'off' = 'off';
    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Input() type = 'text';
    @Input() required: boolean;
    @Input() minlength: number;
    @Input() maxlength: number;
    /** entry for custom errors */
    @Input() errors: Array<string>;
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
        @Optional() @Self() @Inject(NgControl) public ngControl: NgControl,
        @Optional() @Inject(FormGroupDirective) private formGroup: FormGroupDirective,
    ) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngOnChanges(e) {
        if (e.errors) {
            this.setErrorsState();
            this.setHintState();
        }
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

    setDisabledState(value: boolean): void {
        this.disabled = value;
    }

    setError = (value: string): void => {
        this.error = value;
        this.setErrorState();
        this.setHintState();
    }

    setErrorState = (): void => {
        this.errorState = this.error ? 1 : 0;
    }

    setHintState = (): void => {
        this.hintState = !this.error && Array.isArray(this.errors) && this.errors.length === 0 ? 1 : 0;
    }

    setErrorsState = (): void => {
        this.errorsState = this.errors ? this.errors.length : 0;
    }

    updateControl = (): void => {
        this.ngControl.control.markAsDirty();
        this.ngControl.control.markAsTouched();
        this.ngControl.control.updateValueAndValidity();
    }
}
