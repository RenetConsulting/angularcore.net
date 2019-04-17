import { AbstractControl, ValidationErrors } from '@angular/forms';
import { IDecodedCaptcha } from './decoded-captcha';

export function CoreCaptchaRequired(control: AbstractControl): ValidationErrors | null {
    const model: IDecodedCaptcha = control.value;
    return model && model.captcha ? null : { 'required': true };
}