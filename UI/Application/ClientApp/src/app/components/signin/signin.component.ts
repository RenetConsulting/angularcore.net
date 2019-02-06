import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAX_LENGTH_EMAIL } from '../../consts/max.length.email';
import { MAX_LENGTH_PASSWORD } from '../../consts/max.length.password';
import { MIN_LENGTH_EMAIL } from '../../consts/min.length.email';
import { IUser } from '../../interfaces/user';
import { AuthorizationService } from '../../services/authorization/authorization.service';

@Component({
    selector: 'signin',
    templateUrl: './signin.component.html',
    styleUrls: [
        '../signup/signup.component.scss',
        './signin.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninComponent implements OnInit {

    formGroup: FormGroup;

    constructor(
        @Inject(AuthorizationService) private authorizationService: AuthorizationService,
        @Inject(Router) private router: Router
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_EMAIL), Validators.email, Validators.maxLength(MAX_LENGTH_EMAIL)]),
            password: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_EMAIL), Validators.maxLength(MAX_LENGTH_PASSWORD)])
        } as MapPick<IUser, keyof IUser, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.authorizationService.signin(this.formGroup.value).subscribe(() => this.router.navigate(['/']));
        }
    }
}
