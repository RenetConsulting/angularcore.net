import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EMAIL_VALIDATORS } from '../../consts/email.validators';
import { PASSWORD_VALIDATORS } from '../../consts/password.validators';
import { IUser } from '../../interfaces/user';
import { AuthorizationService } from '../../services/authorization/authorization.service';

@Component({
    selector: 'signin',
    templateUrl: './signin.component.html',
    styleUrls: [
        '../signup/signup.component.scss',
        './signin.component.scss'
    ]
})
export class SigninComponent implements OnInit {

    formGroup: FormGroup;
    errors: MapPick<IUser, keyof IUser, Array<string>>;

    constructor(
        @Inject(AuthorizationService) private authorizationService: AuthorizationService,
        @Inject(Router) private router: Router
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            email: new FormControl('', [...EMAIL_VALIDATORS]),
            password: new FormControl('', [...PASSWORD_VALIDATORS])
        } as MapPick<IUser, keyof IUser, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.errors = null;
            this.authorizationService.signin(this.formGroup.value)
                .subscribe(() => this.router.navigate(['/']), e => this.errors = e.error);
        }
    }
}
