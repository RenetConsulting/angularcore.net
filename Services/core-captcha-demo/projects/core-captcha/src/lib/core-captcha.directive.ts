import { ContentChild, Directive, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CoreCaptchaComponent } from './core-captcha.component';
import { IDecodedCaptcha } from './decoded.captcha';

@Directive({
    // tslint:disable-next-line
    selector: 'ngx-core-captcha[formControlName],ngx-core-captcha[formControl],ngx-core-captcha[ngModel]',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CoreCaptchaDirective), multi: true }
    ],
})
export class CoreCaptchaDirective implements ControlValueAccessor {

    @ContentChild(CoreCaptchaComponent) readonly host: CoreCaptchaComponent;
    onChange: (value: IDecodedCaptcha) => void;
    onTouched: () => void;

    constructor() { }

    @HostListener('resolved', ['$event']) resolve = (model: IDecodedCaptcha): void => {
        if (this.onChange) {
            this.onChange(model);
        }
        if (this.onTouched) {
            this.onTouched();
        }
    }

    writeValue(value: string): void {
        if (!value && this.host) {
            this.host.destroy();
        }
    }

    registerOnChange(fn): void {
        this.onChange = fn;
    }

    registerOnTouched(fn): void {
        this.onTouched = fn;
    }
}
