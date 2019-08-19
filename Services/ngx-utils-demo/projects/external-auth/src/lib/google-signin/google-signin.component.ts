import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { FAILED_EXTRACT_TOKEN } from '../error-codes';
import { ExternalAuthBase } from '../external-auth.base';
import { IGoogleError } from '../google-error';
import { GOOGLE_SCRIPT_URL } from '../google-script-url';

declare const window;
declare const gapi;

/**
 * workaround for google (DOC doesn't have unlistener)
 * a user can be get correctrly only in the method {@link listen} in other ways a token will be undefined
 * so we have to use a singleton to only one listener and update data dynamically to be sure that events emit correctly
 */
const listeners = new Map<number, (x) => void>();
let id = 0;

/** to read more see https://developers.google.com/identity/sign-in/web/reference */
@Component({
    selector: 'google-signin',
    templateUrl: './google-signin.component.html',
    styleUrls: ['./google-signin.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleSigninComponent extends ExternalAuthBase<IGoogleError> implements OnInit, OnDestroy {

    @Input() clientId: string;
    @Input() scope = 'openid';
    iconClass = 'fab fa-google';
    provider = 'google';
    label = 'Continue with google';
    readonly apiName = 'client:auth2';
    readonly id = id++;

    constructor(
        @Inject(Injector) injector: Injector,
        @Inject(GOOGLE_SCRIPT_URL) readonly scriptUrl: string
    ) {
        super(injector);
    }

    ngOnInit(): void {
        listeners.set(this.id, this.authListener);
    }

    ngOnDestroy(): void {
        listeners.delete(this.id);
    }

    initSignin = (): void => {
        this.setListener();
        this.signin();
    }

    init = (): void => gapi.load(this.apiName, this.setConfig);

    setConfig = (): void => gapi.client.init({ clientId: this.clientId, scope: this.scope }).then(this.initSignin, this.handleError);

    setListener = (): void => gapi.auth2.getAuthInstance().currentUser.listen(x => listeners.forEach(listener => listener(x)));

    authListener = (x): void => {
        const token = x.getAuthResponse();
        if (token && token.id_token) {
            this.getToken(token.id_token);
        }
        else {
            this.handleError({ error: FAILED_EXTRACT_TOKEN } as IGoogleError);
        }
    }

    signin = (): void => gapi.auth2.getAuthInstance().grantOfflineAccess().then(null, this.handleError);

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
}
