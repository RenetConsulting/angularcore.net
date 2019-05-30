import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Inject, Input, NgZone, OnChanges, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService, TokenService } from '@renet-consulting/auth';
import { BASE_URL } from '~/tokens/base-url.token';
import { SetAuthorized } from '../../actions';

declare const window;
declare var FB: any;

/** TODO: center the dialog */
/** TODO: test changes */
@Component({
    selector: 'signin-external',
    templateUrl: './signin-external.component.html',
    styleUrls: ['./signin-external.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninExternalComponent implements OnChanges, OnInit {

    @HostBinding('class.d-block') readonly dBlock = true;
    /** possible variants: facebook, google, twitter et. */
    @Input() provider: string;
    @Input() label: string;
    @Input() iconClass: string;
    providerWindow;

    constructor(
        @Inject(NgZone) private zone: NgZone,
        @Inject(Router) private router: Router,
        @Inject(BASE_URL) private baseUrl: string,
        @Inject(PLATFORM_ID) private platformId: any,
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(AuthService) private authService: AuthService,
        @Inject(Store) private store: Store<null>,
    ) { }

    ngOnChanges(): void {
        this.label = this.label ? this.label : this.provider ? this.provider : null;
    }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {

            // close previously opened windows (if any)
            this.closeDialog();

            // instantiate the externalProviderLogin function
            // (if it doesn't exist already)
            if (!window.externalProviderLogin) {
                window.externalProviderLogin = this.signin;
            }
        }




        if (typeof FB === 'undefined') {

            // if the FB oject is undefined, 
            // it means that it's the first time
            // we visit this page, hence we need
            // to initialize the Facebook SDK

            window.fbAsyncInit = () => {

                console.log('fbAsyncInit')
                // be sure to do this within 
                // the local zone, or Angular will be
                // unable to find the local references
                this.zone.run(() => {
                    FB.init({
                        appId: '406258573277906',
                        xfbml: true,
                        cookie: false,
                        version: 'v2.10'
                    });
                    FB.AppEvents.logPageView();

                    // this will trigger right after the user 
                    // completes the FB SDK Auth roundtrip successfully
                    FB.Event.subscribe('auth.statusChange', (
                        (result: any) => {
                            console.log("FB auth status changed");
                            console.log(result);
                            if (result.status === 'connected') {
                                // login successful
                                console.log('Connected to Facebook.');
                                this.statusChange(result.authResponse.accessToken);
                            }
                        })
                    );
                });
            }


            // Load the SDK js library (only once)
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) { return; }
                js = d.createElement(s); js.id = id;
                (<any>js).src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode!.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

        }
        else {

            // Reload the FB login button
            window.FB.XFBML.parse();

            // if the user is still connected, log him off.
            FB.getLoginStatus(console.info);
        }

    }

    private signin = (): void => {
        this.zone.run(() => {
            this.authService.getToken({ grant_type: 'external_identity_token' } as any).subscribe(x => {
                this.tokenService.setToken({ ...x, refresh_token: 'fake' })
                this.store.dispatch(new SetAuthorized(true));
                this.router.navigate(['']);
            });
        });
    }

    private closeDialog = (): void => {
        if (this.providerWindow) {
            this.providerWindow.close();
        }
        this.providerWindow = null;
    }

    submit = (_: string) => {
        FB.login(function (response) {
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ', response);
                FB.api('/me', function (response) {
                    console.log('Good to see you, ' + response.name + '.', response);
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        });
    }

    statusChange = (access_token: string) => {
        this.authService.getToken({ grant_type: 'external_identity_token', access_token } as any).subscribe(x => {
            console.log(x)
        });
    }

    submit01 = (provider: string): void => {
        if (isPlatformBrowser(this.platformId) && provider) {
            const url = `${this.baseUrl}/connect/token/external/${provider}`;

            // minimalistic mobile devices support
            const w = (screen.width >= 1050) ? 1050 : screen.width;
            const h = (screen.height >= 550) ? 550 : screen.height;
            const params = 'toolbar=yes,scrollbars=yes,resizable=yes,width=' + w + ', height=' + h;

            // close previously opened windows (if any)
            this.closeDialog();
            this.providerWindow = window.open(url, 'ExternalProvider', params, false);
        }
    }
}
