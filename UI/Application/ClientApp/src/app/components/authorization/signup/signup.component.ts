import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { InputsErrorsBase } from '../../bases/inputs-errors/inputs-errors';
import { EMAIL_VALIDATORS } from '../../consts/email.validators';
import { PASSWORD_VALIDATORS } from '../../consts/password.validators';
import { Messages } from '../../enums/messages.type';
import { IUser } from '../../interfaces/user';
import { AuthorizationService } from '../../services/authorization/authorization.service';
import { MessageHandlerService } from '../../services/message-handler/message-handler.service';

@Component({
    selector: 'signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent extends InputsErrorsBase<IUser> implements OnInit {

    formGroup: FormGroup;

    constructor(
        @Inject(MessageHandlerService) private messageHandlerService: MessageHandlerService,
        @Inject(AuthorizationService) private authorizationService: AuthorizationService,
        @Inject(Router) private router: Router
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
            email: new FormControl('', [...EMAIL_VALIDATORS]),
            password: new FormControl('', [...PASSWORD_VALIDATORS]),
            confirmPassword: new FormControl('', [...PASSWORD_VALIDATORS, this.matchPasswordValidator]),
            readTerms: new FormControl(false, [Validators.requiredTrue]),
        } as MapPick<IUser, keyof IUser, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.errors = null;
            this.authorizationService.signup(this.formGroup.value)
                .pipe(
                    tap(() => this.messageHandlerService.handleSuccess(Messages.checkEmail)))
                .subscribe(() => this.router.navigate(['/sign-in']), this.handleError);
        }
    }
}
