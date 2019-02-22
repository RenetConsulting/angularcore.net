import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMAIL_VALIDATORS } from '../../../consts/email.validators';
import { PASSWORD_VALIDATORS } from '../../../consts/password.validators';
import { MessagesType } from '../../../enums/messages.type';
import { IUser } from '../../../interfaces/user';
import { AuthorizationService } from '../../../services/authorization/authorization.service';

/// MessagesType.checkEmail
@Component({
    selector: 'signup',
    templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {

    formGroup: FormGroup;

    constructor(
        @Inject(AuthorizationService) private authorizationService: AuthorizationService,
        @Inject(Router) private router: Router
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
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
            readTerms: new FormControl(false, [Validators.requiredTrue]),
        } as MapPick<IUser, keyof IUser, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.authorizationService.signup(this.formGroup.value)
                .subscribe(() => this.router.navigate(['/sign-in']));
        }
    }
}
