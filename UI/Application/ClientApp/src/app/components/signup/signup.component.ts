import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { EMAIL_VALIDATORS } from '../../consts/email.validators';
import { PASSWORD_VALIDATORS } from '../../consts/password.validators';
import { IUser } from '../../interfaces/user';
import { AuthorizationService } from '../../services/authorization/authorization.service';

@Component({
    selector: 'signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

    formGroup: FormGroup;
    errors: MapPick<IUser, keyof IUser, Array<string>>;

    constructor(
        @Inject(AuthorizationService) private authorizationService: AuthorizationService,
        @Inject(Router) private router: Router
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
    }

    matchPasswordValidator = (control: AbstractControl): ValidationErrors | null => {
        return control.value === (this.formGroup && this.formGroup.controls.password.value) ? null
            : { errorMessage: 'The password and confirmation password do not match.' };
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            email: new FormControl('', [...EMAIL_VALIDATORS]),
            password: new FormControl('', [...PASSWORD_VALIDATORS]),
            confirmPassword: new FormControl('', [...PASSWORD_VALIDATORS, this.matchPasswordValidator]),
        } as MapPick<IUser, keyof IUser, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.errors = null;
            this.authorizationService.signup(this.formGroup.value)
                .subscribe(() => this.router.navigate(['/sign-in']), e => this.errors = e.error);
        }
    }
}
