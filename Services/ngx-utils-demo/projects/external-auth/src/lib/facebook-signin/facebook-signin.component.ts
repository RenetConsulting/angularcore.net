import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
    readonly subscription = new Subscription();
    iconClass = 'fab fa-facebook-square';
    provider = 'facebook';
    label = 'Continue with facebook';

    constructor(
        @Inject(Injector) injector: Injector,
        @Inject(FACEBOOK_SCRIPT_URL) readonly scriptUrl: string
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.subscription.add(this.signedError.subscribe(this.signout));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    init = (): void => {
        FB.init({ appId: this.appId, version: this.version });
        this.signin();
    }

    setInit = (): void => {
        window.fbAsyncInit = this.init;
    }

    fbSignin = (): void => FB.login(x => {
        if (x.authResponse) {
            this.getToken(x.authResponse.accessToken);
        }
    })

    signin = (): void => {
        FB.getLoginStatus(x => {
            if (x.authResponse) {
                this.signout(() => this.fbSignin());
            }
            else {
                this.fbSignin();
            }
        });
    }

    signout = (fn?: () => void): void => FB.logout(fn);

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
