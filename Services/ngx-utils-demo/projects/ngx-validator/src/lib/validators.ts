import { AbstractControl, UntypedFormGroup, ValidationErrors } from '@angular/forms';

export const mismatchPasswordValidator = (name = 'password', errorMessage = 'The password and confirmation password do not match.') =>
    (control: AbstractControl): ValidationErrors | null => {
        const formGroup = control.parent as UntypedFormGroup;
        const value = formGroup && formGroup.controls[name].value;
        return control.value !== value ? { errorMessage } : null;
    };

export const phoneValidator = (regExp: RegExp, errorMessage = 'Invalid phone number.') =>
    (control: AbstractControl): ValidationErrors | null => {
        return regExp ? new RegExp(regExp).test(control.value) ? null : { errorMessage } : null;
    };
