import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EMAIL_VALIDATORS } from '../../../consts/email.validators';
import { IUser } from '../../../interfaces/user';
import { PrepResetPassword } from './actions';

@Component({
    selector: 'prep-reset-password',
    templateUrl: './prep-reset-password.component.html',
})
export class PrepResetPasswordComponent implements OnInit {

    formGroup: FormGroup;

    constructor(
        @Inject(Store) private store: Store<null>
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
            this.store.dispatch(new PrepResetPassword(this.formGroup));
        }
    }
}
