import { Directive, EventEmitter, HostListener, Inject, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
    // tslint:disable-next-line
    selector: '[validate][formControlName], [validate][formControl]',
})
export class NgxValidatorDirective implements OnChanges, OnInit, OnDestroy {

    @Input() label: string;
    @Input() placeholder: string;
    @Output() readonly validate = new EventEmitter<string | null>();
    readonly subscription = new Subscription();
    title = 'Field';

    constructor(
        @Inject(NgControl) private ngControl: NgControl
    ) { }

    ngOnChanges(): void {
        this.emitError();
        this.setTitle();
    }

    ngOnInit(): void {
        this.subscription.add(this.ngControl.statusChanges.subscribe(this.emitError));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    /** internal */
    @HostListener('blur') blur = (): void => this.emitError();

    /** internal */
    get error(): string | null {
        const errors = this.ngControl.errors;
        if (errors) {
            /**
             * {@link @angular/forms} validator errors
             * all errors interfaces you can find at https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
             */
            if (errors.required) {
                return `The ${this.title} is required.`;
            }
            else if (errors.email) {
                return `The ${this.title} is invalid.`;
            }
            else if (errors.minlength) {
                return `The length of the ${this.title} must be at least ${errors.minlength.requiredLength} characters long.`;
            }
            else if (errors.maxlength) {
                return `The length of the ${this.title} must be at most ${errors.maxlength.requiredLength} characters long.`;
            }

            /** for all not specified and custom errors */
            else if (errors.errorMessage) {
                return errors.errorMessage;
            }
        }
        return null;
    }

    /** internal */
    emitError = (): void => {
        if (this.ngControl.enabled && this.ngControl.touched) {
            this.validate.emit(this.error);
        }
    }

    /** internal */
    setTitle = (): void => {
        this.title = this.label || this.placeholder || this.title;
    }
}
