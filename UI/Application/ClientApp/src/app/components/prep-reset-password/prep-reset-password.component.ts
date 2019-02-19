import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { EMAIL_VALIDATORS } from '../../consts/email.validators';
import { Messages } from '../../enums/messages';
import { IUser } from '../../interfaces/user';
import { AccountService } from '../../services/account/account.service';
import { MessageHandlerService } from '../../services/message-handler/message-handler.service';

/** Preparation to reset a password */
@Component({
    selector: 'prep-reset-password',
    templateUrl: './prep-reset-password.component.html',
    styleUrls: [
        '../signup/signup.component.scss',
        './prep-reset-password.component.scss'
    ]
})
export class PrepResetPasswordComponent implements OnInit {

    formGroup: FormGroup;

    constructor(
        @Inject(AccountService) private accountService: AccountService,
        @Inject(MessageHandlerService) private messageHandlerService: MessageHandlerService
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            email: new FormControl('', [...EMAIL_VALIDATORS]),
        } as MapPick<IUser, keyof IUser, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.accountService.prepResetPassword(this.formGroup.value)
                .pipe(
                    tap(() => this.formGroup.reset()))
                .subscribe(() => this.messageHandlerService.handleSuccess(Messages.checkEmail));
        }
    }
}
