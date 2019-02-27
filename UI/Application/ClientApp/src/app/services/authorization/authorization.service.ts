import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HTTP_HEADERS } from '../../consts/http-headers';
import { IConnectToken } from '../../interfaces/connect-token';
import { IToken } from '../../interfaces/token';
import { IUser } from '../../interfaces/user';
import { TokenService } from '../../services/token/token.service';
import { ToolsService } from '../../services/tools/tools.service';

@Injectable({
    providedIn: 'root'
})
export class AuthorizationService {

    constructor(
        @Inject(HttpClient) private http: HttpClient,
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(ToolsService) private toolsService: ToolsService,
    ) { }

    signin = (model: IUser) => {
        const item: IConnectToken = {
            scope: 'offline_access',
            grant_type: 'password',
            password: model.password,
            username: model.email
        };
        const body = this.toolsService.getQuery(item).replace(/^\?/, '');
        const options = {
            headers: {
                ...HTTP_HEADERS.contentTypeUrlencoded,
                ...HTTP_HEADERS.allowAnonymous,
                ...HTTP_HEADERS.allowHttpError
            }
        };
        return this.http.post<IToken>(`/connect/token`, body, options);
    }

    signup = (model: IUser) => this.http
        .post(`/api/account/register`, model, { headers: { ...HTTP_HEADERS.allowHttpError } })

    signout = () => this.http
        .get<IToken>(`/api/account/signout`, { headers: { ...HTTP_HEADERS.allowExpiredToken } }).pipe(
            tap(this.tokenService.clean)
        )
}