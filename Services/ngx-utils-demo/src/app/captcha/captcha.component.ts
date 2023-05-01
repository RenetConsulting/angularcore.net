import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { CoreCaptchaRequired } from 'projects/core-captcha/src/public_api';

@Component({
    selector: 'app-captcha',
    templateUrl: './captcha.component.html',
    styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent {

    readonly errors = ['Please fill captcha'];
    readonly formGroup = new UntypedFormGroup({
        captcha: new UntypedFormControl(null, [CoreCaptchaRequired])
    });
    url = 'https://corecaptcha.azurewebsites.net/api/CaptchaCreate';
    toggled: boolean;

    constructor() { }

    submit = console.log;

    resolved = (e) => {
        console.log('resolved', e, this.formGroup.value);
    }
}
