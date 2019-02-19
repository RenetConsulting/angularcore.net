import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InputsErrorsBase } from '../../bases/inputs-errors/inputs-errors';
import { EMAIL_VALIDATORS } from '../../consts/email.validators';
import { PASSWORD_VALIDATORS } from '../../consts/password.validators';
import { IUser } from '../../interfaces/user';
import { AuthorizationService } from '../../services/authorization/authorization.service';
import { MessageHandlerService } from '../../services/message.handler/message.handler.service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
    selector: 'signin',
    templateUrl: './signin.component.html',
    styleUrls: [
        '../signup/signup.component.scss',
        './signin.component.scss'
    ]
})
export class SigninComponent extends InputsErrorsBase<IUser> implements OnInit {

    formGroup: FormGroup;

    constructor(
        @Inject(MessageHandlerService) messageHandlerService: MessageHandlerService,
        @Inject(AuthorizationService) private authorizationService: AuthorizationService,
        @Inject(StorageService) private storageService: StorageService,
        @Inject(Router) private router: Router
    ) {
        super(messageHandlerService);
    }

    ngOnInit(): void {
        this.setFormGroup();
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            email: new FormControl('', [...EMAIL_VALIDATORS]),
            password: new FormControl('', [...PASSWORD_VALIDATORS]),
            isRemember: new FormControl(false),
        } as MapPick<IUser, keyof IUser, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.errors = null;
            this.storageService.setStorage(this.formGroup.controls.isRemember.value);
            this.authorizationService.signin(this.formGroup.value)
                .subscribe(() => this.router.navigate(['/']), this.handleError);
        }
    }
}