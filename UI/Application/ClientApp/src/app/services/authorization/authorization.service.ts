import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { IConnectToken } from "../../interfaces/connect.token";
import { IToken } from "../../interfaces/token";
import { IUser } from "../../interfaces/user";
import { BASE_URL } from "../../tokens/base.url";
import { TokenService } from "../token/token.service";
import { ToolsService } from "../tools/tools.service";

@Injectable({
    providedIn: "root"
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

    getToken = (request: IConnectToken, headers?: { [key: string]: string }): Observable<IToken> => {
        const body = this.toolsService.getQuery(request).replace(/^\?/, "");
        const options = {
            headers: new HttpHeaders({
                ...headers,
                "Content-Type": "application/x-www-form-urlencoded"
            })
        };
        return this.http
            .post<IToken>(`${this.baseUrl}/connect/token`, body, options).pipe(
                tap(i => this.tokenService.token = i, this.signout)
            )
    }

    refreshToken = (headers: { [key: string]: string }): Observable<any> => {
        const model: IConnectToken = {
            grant_type: "refresh_token",
            scope: "offline_access",
            refresh_token: this.tokenService.valueByProperty("refresh_token")
        };
        return this.getToken(model, headers);
    }

    signin = (model: IUser): Observable<IToken> => {
        const request: IConnectToken = {
            grant_type: "password",
            scope: "offline_access",
            password: model.password,
            username: model.email
        };
        return this.getToken(request);
    }

    signup = (model: IUser) => this.http
        .post(`${this.baseUrl}/api/account/register`, model);

    changePassword = (model: IUser) => this.http
        .post(`${this.baseUrl}/api/account/ResetPasswordFromMail`, model);

    resetPassword = (email: string) => {
        const body = this.toolsService.getQuery({ email });
        return this.http
            .get(`${this.baseUrl}/api/account/ResetPassword${body}`);
    }

    signout = (): void => this.tokenService.clean();
}
