import { Directive, Inject, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[validator]',
})
export class ValidatorDirective implements OnChanges, OnInit, OnDestroy {

    @Input('validator') element: HTMLElement;
    @Input() placeholder: string;
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

    hasError = (): boolean => !!this.ngControl.errors;

    setError = (): void => {
        if (this.hasError() && this.element) {
            this.element.innerText = this.getError();
        }
    }
}