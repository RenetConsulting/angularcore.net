import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { EMAIL_VALIDATORS } from '~/consts/email.validators';
import { IConfirmEmail } from '~/interfaces/confirm-email';
import { ConfirmEmailRequest } from './actions';
import { MapPick } from '../../../../../src/typings';

@Component({
    selector: 'confirm-email',
    templateUrl: './confirm-email.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {

    readonly subscription = new Subscription();
    formGroup: FormGroup;

    constructor(
        @Inject(Store) private store: Store<null>,
        @Inject(ActivatedRoute) private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
        this.subscription.add(this.route.queryParams.subscribe(i => { this.setToken(i.token); this.setEmail(i.email); }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            email: new FormControl('', EMAIL_VALIDATORS),
            token: new FormControl('', [Validators.required]),
        } as MapPick<IConfirmEmail, keyof IConfirmEmail, FormControl>);
    }

    setToken = (value: string): void => this.formGroup.controls.token.patchValue(value);
    setEmail = (value: string): void => this.formGroup.controls.email.patchValue(value);

    submit = (): void => {
        if (this.formGroup.valid) {
            this.store.dispatch(new ConfirmEmailRequest(this.formGroup));
        }
    }
}
