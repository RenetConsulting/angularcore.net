import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators, FormGroup } from '@angular/forms';
import { NgxHttpParamsService } from 'projects/ngx-utils/src/public-api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    readonly title = 'ngx-utils-demo';
    readonly formControl = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(6),
        this.helloBobValidator
    ]);
    readonly formGroup = new FormGroup({ control: this.formControl });
    errorMessage: string;

    constructor(
        private util: NgxHttpParamsService,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.http.get('https://httpbin.org/get', {
            params: this.util.getParams({
                param1: 'val1',
                param2: 2,
                numbers: [1, 2, 3, 4],
                fruits: ['apple', 'pear', 'peach'],
                vegetables: { tomato: 1, potato: 0.5, cucumber: 4 },
            })
        }).subscribe(console.log);
    }

    /** internal */
    helloBobValidator(control: AbstractControl): ValidationErrors | null {
        return control.value && control.value.toLowerCase() === 'bob' ? { errorMessage: 'Hello Bob!!!' } : null;
    }

    setError = (e) => this.errorMessage = e;
}
