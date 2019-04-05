import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { share } from 'rxjs/operators';
import { PASSWORD_VALIDATORS } from '~/consts/password.validators';
import { MessagesType } from '~/enums/messages.type';
import { IChangePassword } from '~/interfaces/change-password';
import { ChangePassword, ResetError } from './actions';
import { ChangePasswordStore } from './reducer';
import { selectChangePasswordError } from './selectors';

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

    readonly errors = this.store.select(selectChangePasswordError).pipe(share());
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

    matchPasswordValidator = (control: AbstractControl): ValidationErrors | null => {
        return control.value === (this.formGroup && this.formGroup.controls.password.value) ? null
            : { errorMessage: MessagesType.passwordsDoNotMatch };
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            oldPassword: new FormControl('', [...PASSWORD_VALIDATORS]),
            password: new FormControl('', [...PASSWORD_VALIDATORS]),
            confirmPassword: new FormControl('', [...PASSWORD_VALIDATORS, this.matchPasswordValidator]),
        } as MapPick<IChangePassword, keyof IChangePassword, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.store.dispatch(new ChangePassword(this.formGroup));
        }
    }
}
