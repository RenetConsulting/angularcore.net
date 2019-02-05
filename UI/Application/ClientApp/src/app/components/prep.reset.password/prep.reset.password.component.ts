import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { MaxLengthBase } from '../../bases/max.length/max.length.base';
import { IUser } from '../../interfaces/user';
import { AccountService } from '../../services/account/account.service';
import { MessageHandlerService } from '../../services/message.handler/message.handler.service';

/** Preparation to reset a password */
@Component({
    selector: 'prep-reset-password',
    templateUrl: './prep.reset.password.component.html',
    styleUrls: ['./prep.reset.password.component.scss']
})
export class PrepResetPasswordComponent extends MaxLengthBase implements OnInit {

    formGroup: FormGroup;

    constructor(
        @Inject(AccountService) private accountService: AccountService,
        @Inject(MessageHandlerService) private messageHandlerService: MessageHandlerService
    ) {
        super();
    }

    ngOnInit(): void {
        this.setFormGroup();
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.minLength(6), Validators.email]),
        } as MapPick<IUser, keyof IUser, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.accountService.prepResetPassword(this.formGroup.value)
                .pipe(
                    tap(() => this.formGroup.reset()))
                .subscribe(() => this.messageHandlerService.handleSuccess('Please check your email.'));
        }
    }
}
