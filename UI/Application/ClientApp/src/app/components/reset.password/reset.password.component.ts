import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MaxLengthBase } from '../../bases/max.length/max.length.base';
import { IResetPassword } from '../../interfaces/reset.password';
import { AccountService } from '../../services/account/account.service';
import { MessageHandlerService } from '../../services/message.handler/message.handler.service';

@Component({
    selector: 'reset-password',
    templateUrl: './reset.password.component.html',
    styleUrls: [
        '../signup/signup.component.scss',
        './reset.password.component.scss'
    ]
})
export class ResetPasswordComponent extends MaxLengthBase implements OnInit, OnDestroy {

    readonly subscription = new Subscription();
    formGroup: FormGroup;

    constructor(
        @Inject(AccountService) private accountService: AccountService,
        @Inject(MessageHandlerService) private messageHandlerService: MessageHandlerService,
        @Inject(ActivatedRoute) private activatedRoute: ActivatedRoute
    ) {
        super();
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
            : { errorMessage: 'The password and confirmation password do not match.' };
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.minLength(6), Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), this.matchPasswordValidator]),
            token: new FormControl('', [Validators.required]),
        } as MapPick<IResetPassword, keyof IResetPassword, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.accountService.resetPassword(this.formGroup.value)
                .pipe(
                    tap(() => this.formGroup.reset()))
                .subscribe(() => this.messageHandlerService.handleSuccess('The password has been changed successfully.'));
        }
    }
}
