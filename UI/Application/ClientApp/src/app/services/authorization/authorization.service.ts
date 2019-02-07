import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ALLOW_ANONYMOUS_HEADER } from '../../consts/allow.anaymous.header';
import { ALLOW_HTTP_ERROR_HEADER } from '../../consts/allow.http.error.header';
import { IConnectToken } from '../../interfaces/connect.token';
import { IToken } from '../../interfaces/token';
import { IUser } from '../../interfaces/user';
import { BASE_URL } from '../../tokens/base.url';
import { TokenService } from '../token/token.service';
import { ToolsService } from '../tools/tools.service';

@Injectable({
    providedIn: 'root'
})
export class AuthorizationService {

    constructor(
        @Inject(BASE_URL) private baseUrl: string,
        @Inject(HttpClient) private http: HttpClient,
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(ToolsService) private toolsService: ToolsService,
    ) { }

    get isAuthenticated(): boolean {
        return this.tokenService.isValid;
    }

    getToken = (request: IConnectToken): Observable<IToken> => {
        const body = this.toolsService.getQuery(request).replace(/^\?/, '');
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                ALLOW_HTTP_ERROR_HEADER,
                ALLOW_ANONYMOUS_HEADER
            })
        };
        return this.http
            .post<IToken>(`${this.baseUrl}/connect/token`, body, options).pipe(
                tap(this.tokenService.setToken)
            );
    }

    refreshToken = () => this.getToken({
        scope: 'offline_access',
        grant_type: 'refresh_token',
        refresh_token: this.tokenService.getValue('refresh_token')
    })

    signin = (model: IUser) => this.getToken({
        scope: 'offline_access',
        grant_type: 'password',
        password: model.password,
        username: model.email
    })

    signup = (model: IUser) => this.http
        .post(`${this.baseUrl}/api/account/register`, model, { headers: { ALLOW_HTTP_ERROR_HEADER } })

    signout = (): void => this.tokenService.clean();
}