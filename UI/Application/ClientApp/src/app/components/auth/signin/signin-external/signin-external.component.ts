import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Inject, Input, NgZone, OnChanges, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService, TokenService } from '@renet-consulting/auth';
import { SetAuthorized } from '../../actions';

declare const window;
declare var FB: any;

@Component({
    selector: 'signin-external',
    templateUrl: './signin-external.component.html',
    styleUrls: ['./signin-external.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninExternalComponent implements OnChanges, OnInit {

    @HostBinding('class.d-block') readonly dBlock = true;
    @Input() provider: string;
    @Input() label: string;
    @Input() iconClass: string;

    constructor(
        @Inject(NgZone) private zone: NgZone,
        @Inject(Router) private router: Router,
        @Inject(PLATFORM_ID) private platformId: any,
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(AuthService) private authService: AuthService,
        @Inject(Store) private store: Store<null>,
        @Inject(Renderer2) private renderer: Renderer2,
    ) { }

    ngOnChanges(): void {
        this.label = this.label ? this.label : this.provider ? this.provider : null;
    }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            if (typeof FB === 'undefined') {
                this.init();
                this.addScript();
            }
        }
    }

    submit = (): void => {
        FB.getLoginStatus(x => {
            if (x.authResponse) {
                this.getToken(x.authResponse.accessToken);
            }
            else {
                FB.login(z => {
                    if (z.authResponse) {
                        this.zone.run(() => this.getToken(z.authResponse.accessToken));
                    }
                    else {
                        throw new Error('A user canceled Facebook login.');
                    }
                });
            }
        });
    }

    getToken = (access_token: string): void => {
        this.authService.getToken({ grant_type: 'external_identity_token', access_token, state: this.provider } as any).subscribe(x => {
            this.tokenService.setToken({ ...x, refresh_token: 'fake' })
            this.store.dispatch(new SetAuthorized(true));
            this.router.navigate(['']);
        });
    }

    init = (): void => {
        if (window) {
            window.fbAsyncInit = () => this.zone.run(() => FB.init({ appId: '', version: 'v3.3' }));
        }
    }

    // TODO: remove doc
    addScript = (): void => {
        const script = this.renderer.createElement('script');
        this.renderer.setAttribute(script, 'src', '//connect.facebook.net/en_US/sdk.js');
        this.renderer.setAttribute(script, 'defer', '');
        this.renderer.setAttribute(script, 'async', '');
        this.renderer.appendChild(document.head, script);
    }
}
