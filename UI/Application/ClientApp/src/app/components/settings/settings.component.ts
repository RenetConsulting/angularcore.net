import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MessagesType } from '../../enums/messages.type';
import { IPerson } from '../../interfaces/person';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    formGroup: FormGroup;

    constructor() { }

    ngOnInit() {
        this.setFormGroup();
    }

    maskValidator = (control: AbstractControl): ValidationErrors | null => {
        return control.errors && control.errors['Mask error'] ? { errorMessage: MessagesType.phoneInvalid }
            : null;
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            phone: new FormControl('', [Validators.required, this.maskValidator]),
            address: new FormControl(''),
            zipCode: new FormControl(''),
            city: new FormControl(''),
            region: new FormControl(''),
            country: new FormControl(''),
        } as MapPick<IPerson, keyof IPerson, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            console.error("TODO: create")
        }
    }
}
