import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CoreCaptchaRequired } from 'projects/core-captcha/src/public_api';

@Component({
    selector: 'ngx-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    readonly title = 'core-captcha-demo';
    readonly formGroup = new FormGroup({ captcha: new FormControl(null, [CoreCaptchaRequired]) });
    url = 'https://corecaptcha.azurewebsites.net/api/CaptchaCreate';
    toggled: boolean;

    constructor() {
        console.log('constructor', this.formGroup.value);
    }

    resolved = (e) => {
        console.log('resolved', e, this.formGroup.value);
    }
}
