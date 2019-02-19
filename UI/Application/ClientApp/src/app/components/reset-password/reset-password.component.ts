import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InputsErrorsBase } from '../../bases/inputs-errors/inputs-errors';
import { EMAIL_VALIDATORS } from '../../consts/email.validators';
import { PASSWORD_VALIDATORS } from '../../consts/password.validators';
import { Messages } from '../../enums/messages';
import { IResetPassword } from '../../interfaces/reset.password';
import { AccountService } from '../../services/account/account.service';
import { MessageHandlerService } from '../../services/message.handler/message.handler.service';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: [
        '../signup/signup.component.scss',
        './reset-password.component.scss'
    ]
})
export class ResetPasswordComponent extends InputsErrorsBase<IResetPassword> implements OnInit, OnDestroy {

    readonly subscription = new Subscription();
    formGroup: FormGroup;

    constructor(
        @Inject(MessageHandlerService) private messageHandlerService: MessageHandlerService,
        @Inject(AccountService) private accountService: AccountService,
        @Inject(ActivatedRoute) private activatedRoute: ActivatedRoute
    ) {
        super(messageHandlerService);
    }

    ngOnInit(): void {
        this.setFormGroup();
        this.subscription.add(this.activatedRoute.queryParams
            .subscribe((i: Pick<IResetPassword, 'token'>) => this.formGroup.controls.token.reset(i.token)));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    matchPasswordValidator = (control: AbstractControl): ValidationErrors | null => {
        return control.value === (this.formGroup && this.formGroup.controls.password.value) ? null
            : { errorMessage: Messages.passwordsDoNotMatch };
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
            this.errors = null;
            this.accountService.resetPassword(this.formGroup.value)
                .pipe(
                    tap(() => this.formGroup.reset()))
                .subscribe(() => this.messageHandlerService.handleSuccess(Messages.passwordHasChanged), this.handleError);
        }
    }
}
