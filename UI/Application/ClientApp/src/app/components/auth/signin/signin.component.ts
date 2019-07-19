import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { GOOGLE_SCRIPT_URL } from '@renet-consulting/external-auth';
import { StorageService } from '@renet-consulting/storage';
import { Subscription } from 'rxjs';
import { filter, share, take } from 'rxjs/operators';
import { SetError } from '~/actions/messenger.actions';
import { EMAIL_VALIDATORS } from '~/consts/email.validators';
import { PASSWORD_VALIDATORS } from '~/consts/password.validators';
import { IUser } from '~/interfaces/user';
import { RootStore } from '~/reducers';
import { selectCoreCaptchaUrl, selectFacebookAppId, selectGoogleClientId } from '~/selectors/settings.selectors';
import { SetAuthorized } from '../actions';
import { selectAuthUser, selectSigninError } from '../selectors';
import { ResetError, SigninRequest } from './actions';

@Component({
    selector: 'signin',
    templateUrl: './signin.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: GOOGLE_SCRIPT_URL, useValue: `//apis.google.com/js/platform.js?onload=gAsyncInit` }]
})
export class SigninComponent implements OnInit, OnDestroy {

    readonly subscription = new Subscription();
    readonly errors = this.store.select(selectSigninError).pipe(share());
    readonly facebookAppId = this.store.select(selectFacebookAppId);
    readonly googleClientId = this.store.select(selectGoogleClientId);
    readonly coreCaptchaUrl = this.store.select(selectCoreCaptchaUrl);
    formGroup: FormGroup;

    constructor(
        @Inject(Store) private store: Store<RootStore>,
        @Inject(StorageService) private storage: StorageService
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
        this.subscription.add(this.store.select(selectAuthUser).pipe(take(1), filter(i => !!i)).subscribe(this.patchValue));
        this.subscription.add(this.formGroup.valueChanges.subscribe(this.setStorage));
        this.setStorage(this.formGroup.value);
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ResetError());
        this.subscription.unsubscribe();
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            email: new FormControl('', EMAIL_VALIDATORS),
            password: new FormControl('', PASSWORD_VALIDATORS),
            remember: new FormControl(false),
            captcha: new FormControl()
        } as MapPick<IUser, keyof IUser, FormControl>);
    }

    patchValue = (i: IUser): void => this.formGroup.patchValue(i);

    submit = (): void => {
        if (this.formGroup.valid) {
            this.store.dispatch(new SigninRequest(this.formGroup));
        }
    }

    externalSignin = (provider: string) => this.store.dispatch(new SetAuthorized({ authorized: true, provider }));

    externalSigninError = e => this.store.dispatch(new SetError(e && e.details || e && e.error || e));

    setStorage = (user: IUser) => this.storage.setStorage(!user.remember);
}
