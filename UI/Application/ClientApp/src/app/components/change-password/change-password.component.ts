import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { InputsErrorsBase } from '../../bases/inputs-errors/inputs-errors';
import { PASSWORD_VALIDATORS } from '../../consts/password.validators';
import { Messages } from '../../enums/messages';
import { IChangePassword } from '../../interfaces/change.password';
import { AccountService } from '../../services/account/account.service';
import { MessageHandlerService } from '../../services/message.handler/message.handler.service';

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    styleUrls: [
        '../signup/signup.component.scss',
        './change-password.component.scss'
    ]
})
export class ChangePasswordComponent extends InputsErrorsBase<IChangePassword> implements OnInit {

    formGroup: FormGroup;

    constructor(
        @Inject(AccountService) private accountService: AccountService,
        @Inject(MessageHandlerService) private messageHandlerService: MessageHandlerService,
    ) {
        super(messageHandlerService);
    }

    ngOnInit(): void {
        this.setFormGroup();
    }

    matchPasswordValidator = (control: AbstractControl): ValidationErrors | null => {
        return control.value === (this.formGroup && this.formGroup.controls.password.value) ? null
            : { errorMessage: Messages.passwordsDoNotMatch };
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            oldPassword: new FormControl('', [...PASSWORD_VALIDATORS]),
            password: new FormControl('', [...PASSWORD_VALIDATORS]),
            confirmPassword: new FormControl('', [...PASSWORD_VALIDATORS, this.matchPasswordValidator]),
        } as MapPick<IChangePassword, keyof IChangePassword, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.errors = null;
            this.accountService.changePassword(this.formGroup.value)
                .pipe(
                    tap(() => this.formGroup.reset()))
                .subscribe(() => this.messageHandlerService.handleSuccess(Messages.passwordHasChanged), this.handleError);
        }
    }
}
