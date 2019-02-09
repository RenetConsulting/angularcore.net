import { Directive, EventEmitter, HostListener, Inject, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[validator]',
})
export class ValidatorDirective implements OnChanges, OnInit, OnDestroy {

    @Input() placeholder: string;
    @Output('validator') readonly emitter = new EventEmitter<string | null>();
    readonly subscription = new Subscription();

    constructor(
        @Inject(NgControl) private ngControl: NgControl
    ) { }

    ngOnChanges(): void {
        this.setError();
    }

    ngOnInit(): void {
        this.subscription.add(this.ngControl.statusChanges.subscribe(this.setError));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    @HostListener('blur') blur = (): void => this.setError();

    getError = (errors: ValidationErrors = this.ngControl.errors): string | null => {
        if (errors) {
            if (errors.required) {
                return `The ${this.placeholder} is required.`;
            }
            else if (errors.email) {
                return `The ${this.placeholder} is invalid.`;
            }
            else if (errors.minlength) {
                return `The length of the ${this.placeholder} must be at least ${errors.minlength.requiredLength} characters long.`;
            }
            else if (errors.maxlength) {
                return `The length of the ${this.placeholder} must be at most ${errors.maxlength.requiredLength} characters long.`;
            }
            else if (errors.errorMessage) {
                return errors.errorMessage;
            }
        }
        return null;
    }

    setError = (): void => {
        if (this.ngControl.enabled && this.ngControl.touched) {
            this.emitter.emit(this.getError());
        }
    }
}