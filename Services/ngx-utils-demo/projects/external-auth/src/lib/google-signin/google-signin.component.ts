import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Injector, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ExternalAuthBase } from '../external-auth.base';
import { GOOGLE_SCRIPT_URL } from '../google-script-url';

declare const window;
declare const gapi;

/**
 * workaround for google (DOC doesn't have unlistener)
 * a user can be get correctrly only in the method {@link listen} in other ways a token will be undefined
 * so we have to use a singleton to only one listener and update data dynamically to be sure that events emit correctly
 */
let signed: EventEmitter<string>;
let provider: string;

/** to read more see https://developers.google.com/identity/sign-in/web/reference */
@Component({
    selector: 'google-signin',
    templateUrl: './google-signin.component.html',
    styleUrls: ['./google-signin.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleSigninComponent extends ExternalAuthBase implements OnChanges, OnInit, OnDestroy {

    @Input() clientId: string;
    @Input() scope = 'profile';
    iconClass = 'fab fa-google';
    provider = 'google';
    label = 'Continue with google';
    readonly apiName = 'client:auth2';

    constructor(
        @Inject(Injector) injector: Injector,
        @Inject(GOOGLE_SCRIPT_URL) readonly scriptUrl: string
    ) {
        super(injector);
        signed = this.signed;
    }

    ngOnChanges(e): void {
        if (e.provider) {
            provider = this.provider;
        }
    }

    initSignin = (): void => {
        this.setListener();
        this.signin();
    }

    init = (): void => gapi.load(this.apiName, this.setConfig);

    setConfig = (): void => gapi.client.init({ clientId: this.clientId, scope: this.scope }).then(this.initSignin);

    setListener = (): void => gapi.auth2.getAuthInstance().currentUser.listen(this.authListener);

    authListener = (x): void => {
        const token = x.getAuthResponse();
        if (token && token.id_token) {
            this.getToken(token.id_token);
        }
    }

    signin = (): void => gapi.auth2.getAuthInstance().grantOfflineAccess();

    signout = (): void => gapi.auth2.getAuthInstance().signOut();

    setInit = (): void => {
        window.gAsyncInit = this.init;
    }

    submit = (): void => {
        if (isPlatformBrowser(this.platformId)) {
            if (typeof gapi === 'undefined') {
                this.setInit();
                this.addScript();
            }
            else {
                this.signin();
            }
        }
    }

    emit = () => signed.emit(provider);
}
