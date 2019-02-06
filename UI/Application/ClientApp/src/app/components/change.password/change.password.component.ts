import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { MAX_LENGTH_PASSWORD } from '../../consts/max.length.password';
import { MIN_LENGTH_EMAIL } from '../../consts/min.length.email';
import { IChangePassword } from '../../interfaces/change.password';
import { AccountService } from '../../services/account/account.service';
import { MessageHandlerService } from '../../services/message.handler/message.handler.service';

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
            oldPassword: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_EMAIL), Validators.maxLength(MAX_LENGTH_PASSWORD)]),
            newPassword: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_EMAIL), Validators.maxLength(MAX_LENGTH_PASSWORD)]),
            confirmNewPassword: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_EMAIL), Validators.maxLength(MAX_LENGTH_PASSWORD), this.matchPasswordValidator]),
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
