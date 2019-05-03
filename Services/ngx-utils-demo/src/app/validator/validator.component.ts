import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
    selector: 'app-validator',
    templateUrl: './validator.component.html',
    styleUrls: ['./validator.component.css']
})
export class ValidatorComponent implements OnInit {

    readonly formControl = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(6),
        this.helloBobValidator
    ]);
    readonly formGroup = new FormGroup({ control: this.formControl });
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
