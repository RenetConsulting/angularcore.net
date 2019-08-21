import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CoreCaptchaRequired } from '@renet-consulting/core-captcha';
import { mismatchPasswordValidator } from '@renet-consulting/ngx-validator';
import { share } from 'rxjs/operators';
import { EMAIL_VALIDATORS } from '~/consts/email.validators';
import { PASSWORD_VALIDATORS } from '~/consts/password.validators';
import { IUser } from '~/interfaces/user';
import { RootStore } from '~/reducers';
import { selectCoreCaptchaUrl } from '~/selectors/settings.selectors';
import { selectSignupError } from '../selectors';
import { SignupRequest } from './actions';

@Component({
    selector: 'signup',
    templateUrl: './signup.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {

    readonly errors = this.store.select(selectSignupError).pipe(share());
    readonly coreCaptchaUrl = this.store.select(selectCoreCaptchaUrl);
    formGroup: FormGroup;

    constructor(
        @Inject(Store) private store: Store<RootStore>
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            email: new FormControl('', EMAIL_VALIDATORS),
            password: new FormControl('', PASSWORD_VALIDATORS),
            confirmPassword: new FormControl('', [...PASSWORD_VALIDATORS, mismatchPasswordValidator()]),
            readTerms: new FormControl(false, [Validators.requiredTrue]),
            captcha: new FormControl(null, [CoreCaptchaRequired])
        } as MapPick<IUser, keyof IUser, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.store.dispatch(new SignupRequest(this.formGroup));
        }
    }
}
