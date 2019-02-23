import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'ngx-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    readonly title = 'core-captcha-demo';
    readonly url = 'https://corecaptcha.azurewebsites.net/api/CaptchaCreate';
    readonly toggled: boolean;
    readonly formGroup = new FormGroup({ captcha: new FormControl('Bob') });

    constructor() {
        console.log(this.formGroup.value);
    }

    resolved = (e) => {
        console.log(e, this.formGroup.value);
    }
}
