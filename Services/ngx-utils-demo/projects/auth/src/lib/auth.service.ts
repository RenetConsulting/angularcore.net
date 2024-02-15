import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params/src/public-api';
import { AuthDefaultOptions } from './auth-default-options';
import { HTTP_HEADERS } from './http-headers';
import { IToken } from './token';
import { IAuthUser } from './user';

interface HttpOptions {
    params?: HttpParams;
    headers?: { [k: string]: string | Array<string> };
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        @Inject(HttpClient) private http: HttpClient,
        @Inject(NgxHttpParamsService) private params: NgxHttpParamsService,
        @Inject(AuthDefaultOptions) private options: AuthDefaultOptions,
    ) { }

    getToken = (token: IToken, options?: HttpOptions) => {
        const headers = {
            ...(options && options.headers),
            ...HTTP_HEADERS.contentTypeUrlencoded,
            ...HTTP_HEADERS.allowAnonymous,
            ...HTTP_HEADERS.allowError,
        };
        const body = this.params.map(token).toString();
        return this.http.post<IToken>(this.options.apiSignin, body, { ...options, headers });
    }

    signin = (user: IAuthUser, options?: HttpOptions) => {
        const token: IToken = {
            scope: 'offline_access',
            grant_type: 'password',
            password: user.password,
            username: user.email
        };
        return this.getToken(token, options);
    }

    signup = (model: IAuthUser, options?: HttpOptions) => this.http
        .post(this.options.apiSignup, model, {
            ...options,
            headers: {
                ...(options && options.headers),
                ...HTTP_HEADERS.allowError
            }
        })

    /** the front-end side should post an expired token to the back-end side */
    signout = () => this.http
        .delete(this.options.apiSignout, { headers: { ...HTTP_HEADERS.allowExpiredToken } })
}
