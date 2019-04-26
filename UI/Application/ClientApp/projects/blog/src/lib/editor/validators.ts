import { AbstractControl, ValidationErrors } from "@angular/forms";

export const mapMinLength = (control: AbstractControl): ValidationErrors | null => {
    const errors = control.errors;
    const minLengthError = errors && errors.minLengthError;
    return minLengthError ? { minlength: { requiredLength: minLengthError.minLength } } : null;
}

export const mapMaxLength = (control: AbstractControl): ValidationErrors | null => {
    const errors = control.errors;
    const minLengthError = errors && errors.maxLengthError;
    return minLengthError ? { maxlength: { requiredLength: minLengthError.maxLength } } : null;
}