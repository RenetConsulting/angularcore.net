/* tslint:disable:max-line-length */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

    readonly formGroup = new FormGroup({
        input: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
        placeholder: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
        organization: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
        textarea: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    });
    exampleErrors = [
        `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s`,
        `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s`
    ];
    errors: Array<string> = [];

    constructor() { }

    ngOnInit() {
    }

    toggle = () => {
        this.errors = this.errors.length === 0 ? [...this.exampleErrors] : [];
    }

    // tslint:disable-next-line
    resize = console.log
}
