import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

// tslint:disable-next-line:max-line-length
export const mismatchPasswordValidator = (name = 'password', errorMessage = 'The password and confirmation password do not match.') => (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control.parent as FormGroup;
    const value = formGroup && formGroup.controls[name].value;
    return control.value !== value ? { errorMessage } : null;
};

// tslint:disable-next-line:max-line-length
export const phoneValidator = (regExp: RegExp, errorMessage = 'Invalid phone number.') => (control: AbstractControl): ValidationErrors | null => {
    return regExp && !regExp.exec(control.value) ? { errorMessage } : null;
};
