import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenIdConnectRequestModel } from "../../models/open.id.connect.request.model";
import { TokenModel } from "../../models/token.model";
import { UserModel } from "../../models/user.model";
import { HttpHandlerService } from "../http.handler/http.handler.service";
import { TokenService } from "../token/token.service";
import { ToolsService } from "../tools/tools.service";

@Injectable()
export class AuthorizationService {

    constructor(
        @Inject("BASE_URL") private baseUrl: string,
        @Inject(HttpClient) private http: HttpClient,
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(ToolsService) private toolsService: ToolsService,
        @Inject(HttpHandlerService) private httpHandlerService: HttpHandlerService
    ) { }

    get isAuthorized(): boolean {
        return this.tokenService.isValid;
    }

    getToken = (request: OpenIdConnectRequestModel, headers?: { [key: string]: string }): Observable<TokenModel> => {
        const body: string = this.toolsService.getQueryString(request).replace(/^\?/, "");
        const options = {
            headers: new HttpHeaders({
                ...headers,
                "Content-Type": "application/x-www-form-urlencoded"
            })
        };
        return this.http
            .post<TokenModel>(`${this.baseUrl}/connect/token`, body, options).pipe(
                map((success) => {
                    this.tokenService.token = success;
                    return success;
                }),
                catchError((error) => {
                    this.logout();
                    return this.httpHandlerService.handleError(error);
                })
            )
    }

    refreshToken = (headers: { [key: string]: string }): Observable<any> => {
        const model = new OpenIdConnectRequestModel({
            grant_type: "refresh_token",
            scope: "offline_access",
            refresh_token: this.tokenService.valueByProperty("refresh_token")
        });
        return this.getToken(model, headers);
    }

    signin = (model: UserModel): Observable<TokenModel> => {
        const request = new OpenIdConnectRequestModel({
            grant_type: "password",
            scope: "offline_access",
            password: model.password,
            username: model.email
        });
        return this.getToken(request);
    }

    signup = (model: UserModel): Observable<null> => {
        return this.http
            .post(`${this.baseUrl}/api/account/register`, model).pipe(
                catchError(this.httpHandlerService.handleError)
            )
    }

    logout = (): void => {
        this.tokenService.clean();
    }
}
