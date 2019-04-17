import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    readonly title = 'ngx-validator-demo';
    readonly formControl = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(6),
        this.helloBobValidator
    ]);
    readonly formGroup = new FormGroup({ control: this.formControl });
    errorMessage: string;

    constructor() { }

    ngOnInit(): void {
    }

    /** internal */
    helloBobValidator(control: AbstractControl): ValidationErrors | null {
        return control.value && control.value.toLowerCase() === 'bob' ? { errorMessage: 'Hello Bob!!!' } : null;
    }

    setError = (e) => this.errorMessage = e;
}
