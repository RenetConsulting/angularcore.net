import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { ExternalAuthBase } from '../external-auth.base';
import { FACEBOOK_SCRIPT_URL } from '../facebook-script-url';

declare const window;
declare const FB;

@Component({
    selector: 'facebook-signin',
    templateUrl: './facebook-signin.component.html',
    styleUrls: ['./facebook-signin.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacebookSigninComponent extends ExternalAuthBase implements OnInit, OnDestroy {

    @Input() appId: string;
    @Input() version = 'v3.3';
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
        FB.init({ appId: this.appId, version: this.version });
        this.signin();
    }

    setInit = (): void => {
        window.fbAsyncInit = this.init;
    }

    signin = (): void => FB.getLoginStatus(x => x.authResponse ? this.getToken(x.authResponse.accessToken)
        : FB.login(z => z.authResponse && this.getToken(z.authResponse.accessToken)))

    signout = (): void => FB.logout(null);

    submit = (): void => {
        if (isPlatformBrowser(this.platformId)) {
            if (typeof FB === 'undefined') {
                this.setInit();
                this.addScript();
            }
            else {
                this.signin();
            }
        }
    }
}
