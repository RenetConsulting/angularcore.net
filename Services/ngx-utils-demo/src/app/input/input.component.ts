/* tslint:disable:max-line-length */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // providers: [{ provide: RESIZE_OBSERVER, useValue: null }]
})
export class InputComponent implements OnInit {

    readonly formGroup = new UntypedFormGroup({
        input: new UntypedFormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
        placeholder: new UntypedFormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
        organization: new UntypedFormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
        textarea: new UntypedFormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    });
    exampleErrors = [
        `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s`,
        `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s`
    ];
    errors: Array<string> = [];
    width: number;

    constructor() { }

    ngOnInit() {
    }

    toggle = () => {
        this.errors = this.errors.length === 0 ? [...this.exampleErrors] : [];
    }

    resize = (e: DOMRectReadOnly) => {
        this.width = e.width;
        console.log(e);
    }
}
