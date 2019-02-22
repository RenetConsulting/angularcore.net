import { ContentChild, Directive, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IDecodedCaptcha } from './decoded.captcha';
import { NgxRecaptchaComponent } from './ngx-recaptcha.component';

@Directive({
    // tslint:disable-next-line
    selector: 'ngx-recaptcha[formControlName],ngx-recaptcha[formControl],ngx-recaptcha[ngModel]',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgxRecaptchaDirective), multi: true }
    ],
})
export class NgxRecaptchaDirective implements ControlValueAccessor {

    @ContentChild(NgxRecaptchaComponent) readonly host: NgxRecaptchaComponent;
    onChange: (value: IDecodedCaptcha) => void;
    onTouched: () => void;

    constructor() { }

    writeValue(value: string): void {
        if (!value && this.host) {
            this.host.reset();
        }
    }

    registerOnChange(fn): void {
        this.onChange = fn;
    }

    registerOnTouched(fn): void {
        this.onTouched = fn;
    }
}
