import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

    formControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
    exampleErrors = ['error1', 'error2'];
    errors: Array<string> = [];

    constructor() { }

    ngOnInit() {
    }

    toggle = () => {
        this.errors = this.errors.length === 0 ? [...this.exampleErrors] : [];
    }
}
