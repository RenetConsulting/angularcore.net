import { Inject, Injectable } from '@angular/core';
import { AuthService, IToken, TokenService } from '@renet-consulting/auth/src/public-api';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ExternalTokenHandlerService {

    constructor(
        @Inject(AuthService) private authService: AuthService,
        @Inject(TokenService) private tokenService: TokenService,
    ) { }

    handle = (access_token: string, state: string): Observable<IToken> => new Observable((observer) => {
        const token = { grant_type: 'external_identity_token', access_token, state, scope: 'offline_access' };
        this.authService.getToken(token).subscribe(x => {
            this.tokenService.setToken(x);
            observer.next(x);
            observer.complete();
        }, e => observer.error(e));
    })
}
