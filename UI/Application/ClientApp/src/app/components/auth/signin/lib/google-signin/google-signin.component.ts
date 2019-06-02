import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Injector, Input } from '@angular/core';
import { ExternalAuthBase } from '../external-auth.base';
import { GOOGLE_SCRIPT_URL } from '../google-script-url';

declare const window;
declare var gapi;

@Component({
    selector: 'google-signin',
    templateUrl: './google-signin.component.html',
    styleUrls: ['./google-signin.component.scss']
})
export class GoogleSigninComponent extends ExternalAuthBase {

    @Input() clientId: string;
    @Input() scope = 'profile';
    iconClass = 'fab fa-google';
    provider = 'google';
    label = 'Continue with google';

    constructor(
        @Inject(Injector) injector: Injector,
        @Inject(GOOGLE_SCRIPT_URL) readonly scriptUrl: string
    ) {
        super(injector);
    }

    init = (): void => gapi.load('client:auth2', () => {
        gapi.client.init({ clientId: this.clientId, scope: this.scope }).then(() => {
            this.setAuthListener();

            this.signin();
        });
    })

    setInit = (): void => {
        window.gAsyncInit = this.init;
    }

    setAuthListener = () => gapi.auth2.getAuthInstance().currentUser.listen(x => {
        const token = x.getAuthResponse();
        if (token && token.id_token) {
            this.getToken(token.id_token);
        }
    })

    signin = (): void => gapi.auth2.getAuthInstance().grantOfflineAccess();

    submit = (): void => {
        if (isPlatformBrowser(this.platformId)) {
            if (typeof gapi === 'undefined') {
                this.addScript();
                this.setInit();
            }
            else {
                this.signin();
            }
        }
    }
}
