import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EMAIL_VALIDATORS } from '~/consts/email.validators';
import { PASSWORD_VALIDATORS } from '~/consts/password.validators';
import { IUser } from '~/interfaces/user';
import { RootStore } from '~/reducers';
import { selectSignupUser } from '../signup/selectors';
import { ResetError, Signin } from './actions';
import { selectSigninError } from './selectors';

@Component({
    selector: 'signin',
    templateUrl: './signin.component.html',
})
export class SigninComponent implements OnInit, OnDestroy {

    readonly subscription = new Subscription();
    formGroup: FormGroup;
    errors: MapPick<IUser, keyof IUser, Array<string>>;

    constructor(
        @Inject(Store) private store: Store<RootStore>
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
        this.subscription.add(this.store.select(selectSignupUser).pipe(filter(i => !!i)).subscribe(i => this.formGroup.reset(i)));
        this.subscription.add(this.store.select(selectSigninError).subscribe(i => this.errors = i));
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ResetError());
        this.subscription.unsubscribe();
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            email: new FormControl('', [...EMAIL_VALIDATORS]),
            password: new FormControl('', [...PASSWORD_VALIDATORS]),
            isRemember: new FormControl(false),
            captcha: new FormControl()
        } as MapPick<IUser, keyof IUser, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.store.dispatch(new Signin(this.formGroup));
        }
    }
}