import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { share } from 'rxjs/operators';
import { EMAIL_VALIDATORS } from '~/consts/email.validators';
import { PASSWORD_VALIDATORS } from '~/consts/password.validators';
import { MessagesType } from '~/enums/messages.type';
import { IResetPassword } from '~/interfaces/reset-password';
import { RootStore } from '~/reducers';
import { ResetError, ResetPassword } from './actions';
import { selectResetPasswordError } from './selectors';

/** the interface of the errors from the back-end side are wrong */
@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

    readonly subscription = new Subscription();
    readonly errors = this.store.select(selectResetPasswordError).pipe(share());
    formGroup: FormGroup;

    constructor(
        @Inject(Store) private store: Store<RootStore>,
        @Inject(ActivatedRoute) private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
        this.subscription.add(this.route.queryParams.subscribe((i: Pick<IResetPassword, 'token'>) => this.setToken(i.token)));
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ResetError());
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

    setToken = (value: string): void => this.formGroup.controls.token.patchValue(value);

    submit = (): void => {
        if (this.formGroup.valid) {
            this.store.dispatch(new ResetPassword(this.formGroup));
        }
    }
}
