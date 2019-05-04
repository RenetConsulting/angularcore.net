import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";
import { MessagesType } from "~/enums/messages.type";

export const mismatchPasswordValidator = (name = 'password') => (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control.parent as FormGroup;
    const value = formGroup && formGroup.controls[name].value;
    return control.value !== value ? { errorMessage: MessagesType.mismatchPassword } : null;
}