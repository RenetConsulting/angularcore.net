import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HTTP_HEADERS } from '../../consts/http-headers';
import { IConnectToken } from '../../interfaces/connect-token';
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
        return this.tokenService.valid;
    }

    get refreshRequest() {
        const request: IConnectToken = {
            scope: 'offline_access',
            grant_type: 'refresh_token',
            refresh_token: this.tokenService.getValue('refresh_token')
        };
        const body = this.toolsService.getQuery(request).replace(/^\?/, '');
        return new HttpRequest('POST', `${this.baseUrl}/connect/token`, body, {
            headers: new HttpHeaders({ ...HTTP_HEADERS.contentTypeUrlencoded, ...HTTP_HEADERS.allowHttpError }),
            responseType: 'json'
        });
    }

    private getToken = (request: IConnectToken, header?: { [key: string]: string }): Observable<IToken> => {
        const body = this.toolsService.getQuery(request).replace(/^\?/, '');
        const options = {
            headers: {
                ...HTTP_HEADERS.contentTypeUrlencoded,
                ...HTTP_HEADERS.allowAnonymous,
                ...header
            }
        };
        return this.http
            .post<IToken>(`${this.baseUrl}/connect/token`, body, options).pipe(
                tap(this.tokenService.setToken)
            );
    }

    signin = (model: IUser) => this.getToken({
        scope: 'offline_access',
        grant_type: 'password',
        password: model.password,
        username: model.email
    }, { ...HTTP_HEADERS.allowHttpError })

    signup = (model: IUser) => this.http
        .post(`${this.baseUrl}/api/account/register`, model, { headers: { ...HTTP_HEADERS.allowHttpError } })

    signout = () => this.http
        .get<IToken>(`${this.baseUrl}/api/account/signout`, { headers: { ...HTTP_HEADERS.allowExpiredToken } }).pipe(
            tap(this.tokenService.clean)
        )
}