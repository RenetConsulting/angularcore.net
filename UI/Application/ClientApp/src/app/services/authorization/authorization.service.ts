import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
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
        @Inject(HttpClient) private httpClient: HttpClient,
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(ToolsService) private toolsService: ToolsService,
        @Inject(HttpHandlerService) private httpHandlerService: HttpHandlerService
    ) { }

    get isAuthorized(): boolean {
        let result: boolean;
        result = (this.tokenService.isValid) ? true : false;
        return result;
    }

    getToken = (request: OpenIdConnectRequestModel, headers?: { [key: string]: string }): Observable<TokenModel> => {
        const body: string = this.toolsService.getQueryString(request).replace(/^\?/, "");
        const options = {
            headers: new HttpHeaders({
                ...headers,
                "Content-Type": "application/x-www-form-urlencoded"
            })
        };
        return this.httpClient
            .post<TokenModel>(`${this.baseUrl}/connect/token`, body, options)
            .map((success) => {
                this.tokenService.clean();
                this.tokenService.token = success;
                return success;
            })
            .catch((error) => {
                this.tokenService.clean();
                return this.httpHandlerService.handleError(error);
            });
    }

    signin = (model: UserModel): Observable<TokenModel> => {
        const request = new OpenIdConnectRequestModel({
            grant_type: "password",
            scope: "offline_access",
            password: model.password,
            username: model.email
        } as OpenIdConnectRequestModel);
        return this.getToken(request);
    }

    signup = (model: UserModel): Observable<null> => {
        return this.httpClient
            .post(`${this.baseUrl}/api/account/register`, model)
            .catch(this.httpHandlerService.handleError);
    }
}
