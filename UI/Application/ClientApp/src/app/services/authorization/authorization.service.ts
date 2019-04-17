import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { HTTP_HEADERS } from '~/consts/http-headers';
import { IConnectToken } from '~/interfaces/connect-token';
import { IToken } from '~/interfaces/token';
import { IUser } from '~/interfaces/user';

@Injectable({
    providedIn: 'root'
})
export class AuthorizationService {

    constructor(
        @Inject(HttpClient) private http: HttpClient,
        @Inject(NgxHttpParamsService) private params: NgxHttpParamsService,
    ) { }

    signin = (model: IUser) => {
        const item: IConnectToken = {
            scope: 'offline_access',
            grant_type: 'password',
            password: model.password,
            username: model.email
        };
        const options = {
            headers: { ...HTTP_HEADERS.contentTypeUrlencoded, ...HTTP_HEADERS.allowAnonymous, ...HTTP_HEADERS.allowHttpError },
            params: this.params.getParams(model.captcha)
        };
        const body = this.params.getParams(item).toString();
        return this.http.post<IToken>(`/connect/token`, body, options);
    }

    signup = (model: IUser) => this.http
        .post(`/api/account/register`, model, {
            headers: { ...HTTP_HEADERS.allowHttpError },
            params: this.params.getParams(model.captcha)
        })

    /** the front-end side should post an expired token to the back-end side */
    signout = () => this.http
        .delete(`/connect/signout`, { headers: { ...HTTP_HEADERS.allowExpiredToken } })
}