import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { IChangePassword } from '../../interfaces/change.password';
import { AccountService } from '../../services/account/account.service';
import { MessageHandlerService } from '../../services/message.handler/message.handler.service';
import { PASSWORD_VALIDATORS } from '../../consts/password.validators';

@Component({
    selector: 'change-password',
    templateUrl: './change.password.component.html',
    styleUrls: ['./change.password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

    formGroup: FormGroup;

    constructor(
        @Inject(AccountService) private accountService: AccountService,
        @Inject(MessageHandlerService) private messageHandlerService: MessageHandlerService,
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
    }

    matchPasswordValidator = (control: AbstractControl): ValidationErrors | null => {
        return control.value === (this.formGroup && this.formGroup.controls.newPassword.value) ? null
            : { errorMessage: 'The new password and new confirmation password do not match.' };
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            oldPassword: new FormControl('', [...PASSWORD_VALIDATORS]),
            newPassword: new FormControl('', [...PASSWORD_VALIDATORS]),
            confirmNewPassword: new FormControl('', [...PASSWORD_VALIDATORS, this.matchPasswordValidator]),
        } as MapPick<IChangePassword, keyof IChangePassword, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.accountService.changePassword(this.formGroup.value)
                .pipe(
                    tap(() => this.formGroup.reset()))
                .subscribe(() => this.messageHandlerService.handleSuccess('The password has been changed successfully.'));
        }
    }
}
