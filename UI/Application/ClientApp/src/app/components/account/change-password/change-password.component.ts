import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { mismatchPasswordValidator } from '@renet-consulting/ngx-validator';
import { PASSWORD_VALIDATORS } from '~/consts/password.validators';
import { IChangePassword } from '~/interfaces/change-password';
import { ChangePasswordRequest, ResetError } from './actions';
import { ChangePasswordStore } from './reducer';
import { selectChangePasswordError } from './selectors';
import { MapPick } from '../../../../../src/typings';

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

    readonly errors = this.store.select(selectChangePasswordError);
    formGroup: FormGroup;

    constructor(
        @Inject(Store) private store: Store<ChangePasswordStore>
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ResetError());
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            oldPassword: new FormControl('', PASSWORD_VALIDATORS),
            password: new FormControl('', PASSWORD_VALIDATORS),
            confirmPassword: new FormControl('', [...PASSWORD_VALIDATORS, mismatchPasswordValidator()]),
        } as MapPick<IChangePassword, keyof IChangePassword, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.store.dispatch(new ChangePasswordRequest(this.formGroup));
        }
    }
}
