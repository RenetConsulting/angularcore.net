import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector, Input } from '@angular/core';
import { ExternalAuthBase } from '../external-auth.base';
import { FACEBOOK_SCRIPT_URL } from '../facebook-script-url';
import { signout } from './util';

declare const window;
declare var FB;

@Component({
    selector: 'facebook-signin',
    templateUrl: './facebook-signin.component.html',
    styleUrls: ['./facebook-signin.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacebookSigninComponent extends ExternalAuthBase {

    @Input() appId: string;
    iconClass = 'fab fa-facebook-f';
    provider = 'facebook';
    label = 'Continue with facebook';

    constructor(
        @Inject(Injector) injector: Injector,
        @Inject(FACEBOOK_SCRIPT_URL) readonly scriptUrl: string
    ) {
        super(injector);
    }

    init = (): void => {
        FB.init({ appId: this.appId, version: 'v3.3' });
        this.signin();
    };

    setInit = (): void => {
        window.fbAsyncInit = this.init;
    }

    //signin = (): void => FB.getLoginStatus(x => x.authResponse ? this.getToken(x.authResponse.accessToken)
    //    : FB.login(z => z.authResponse && this.getToken(z.authResponse.accessToken)))

    /** A user has to be logout before login to have access select different accounts. */
    signin = (): void => {
        FB.getLoginStatus(x => {
            if (x.authResponse) {
                signout(() => this.fbSignin());
            }
            else {
                this.fbSignin();
            }
        })
    }

    fbSignin = (): void => FB.login(z => z.authResponse && this.getToken(z.authResponse.accessToken))

    submit = (): void => {
        if (isPlatformBrowser(this.platformId)) {
            if (typeof FB === 'undefined') {
                this.addScript();
                this.setInit();
            }
            else {
                this.signin();
            }
        }
    }
}
