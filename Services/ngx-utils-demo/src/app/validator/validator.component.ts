import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { phoneUSRegExp, phoneValidator } from 'projects/ngx-validator/src/public-api';

@Component({
    selector: 'app-validator',
    templateUrl: './validator.component.html',
    styleUrls: ['./validator.component.css']
})
export class ValidatorComponent implements OnInit {

    readonly formGroup = new UntypedFormGroup({
        city: new UntypedFormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(6), this.helloBobValidator]),
        address: new UntypedFormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(6), this.helloBobValidator]),
        phone: new UntypedFormControl('', [phoneValidator(phoneUSRegExp)])
    });
    errorMessage: string;
    error: string;

    constructor() { }

    ngOnInit() {
    }

    /** internal */
    helloBobValidator(control: AbstractControl): ValidationErrors | null {
        return control.value && control.value.toLowerCase() === 'bob' ? { errorMessage: 'Hello Bob!!!' } : null;
    }

    setError = (e) => this.errorMessage = e;
}
