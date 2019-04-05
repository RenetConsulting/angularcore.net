import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { share } from 'rxjs/operators';
import { EMAIL_VALIDATORS } from '~/consts/email.validators';
import { PASSWORD_VALIDATORS } from '~/consts/password.validators';
import { MessagesType } from '~/enums/messages.type';
import { IUser } from '~/interfaces/user';
import { RootStore } from '~/reducers';
import { Signup } from './actions';
import { selectSignupError } from './selectors';

@Component({
    selector: 'signup',
    templateUrl: './signup.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {

    readonly errors = this.store.select(selectSignupError).pipe(share());
    formGroup: FormGroup;

    constructor(
        @Inject(Store) private store: Store<RootStore>
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
    }

    matchPasswordValidator = (control: AbstractControl): ValidationErrors | null => {
        return control.value === (this.formGroup && this.formGroup.controls.password.value) ? null
            : { errorMessage: MessagesType.passwordsDoNotMatch };
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            email: new FormControl('', [...EMAIL_VALIDATORS]),
            password: new FormControl('', [...PASSWORD_VALIDATORS]),
            confirmPassword: new FormControl('', [...PASSWORD_VALIDATORS, this.matchPasswordValidator]),
            readTerms: new FormControl(false, [Validators.requiredTrue]),
            captcha: new FormControl(null/*, [Validators.required]*/)
        } as MapPick<IUser, keyof IUser, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.store.dispatch(new Signup(this.formGroup));
        }
    }
}
