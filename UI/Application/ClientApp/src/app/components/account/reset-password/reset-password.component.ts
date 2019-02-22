import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { EMAIL_VALIDATORS } from '../../../consts/email.validators';
import { PASSWORD_VALIDATORS } from '../../../consts/password.validators';
import { MessagesType } from '../../../enums/messages.type';
import { IResetPassword } from '../../../interfaces/reset-password';
import { ResetPassword } from './actions';
import { ResetPasswordStore } from './reducer';
import { selectResetPasswordError } from './selectors';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

    readonly subscription = new Subscription();
    errors: MapPick<IResetPassword, keyof IResetPassword, Array<string>>;
    formGroup: FormGroup;

    constructor(
        @Inject(Store) private store: Store<ResetPasswordStore>,
        @Inject(ActivatedRoute) private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.setFormGroup();
        this.subscription.add(this.route.queryParams.subscribe((i: Pick<IResetPassword, 'token'>) =>
            this.formGroup.controls.token.reset(i.token)));
        this.subscription.add(this.store.select(selectResetPasswordError).subscribe(i => this.errors = i));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
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
            token: new FormControl('', [Validators.required]),
        } as MapPick<IResetPassword, keyof IResetPassword, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.store.dispatch(new ResetPassword(this.formGroup));
        }
    }
}
