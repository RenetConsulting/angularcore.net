import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { OpenIdConnectRequestModel } from "../../models/open.id.connect.request";
import { ResponseTokenModel } from "../../models/response.token";
import { UserModel } from "../../models/user";
import { HttpHandlerService } from "../http.handler/http.handler.service";
import { TokenService } from "../token/token.service";
import { ToolsService } from "../tools/tools.service";

@Injectable()
export class AuthorizationService {

    constructor(
        @Inject("BASE_URL") private baseUrl: string,
        @Inject(HttpClient) private httpClient: HttpClient,
        @Inject(Router) private router: Router,
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(ToolsService) private toolsService: ToolsService,
        @Inject(HttpHandlerService) private httpHandlerService: HttpHandlerService
    ) { }

    get isAuthorized(): boolean {
        let result: boolean;
        result = (this.tokenService.isValid) ? true : false;
        return result;
    }

    private getToken = (request: OpenIdConnectRequestModel): Observable<ResponseTokenModel> => {
        const body: string = this.toolsService.getQueryString(request).replace(/^\?/, "");
        const options = {
            headers: new HttpHeaders({
                "Content-Type": "application/x-www-form-urlencoded",
                "AllowAnonymous": "true"
            })
        };
        return this.httpClient
            .post<ResponseTokenModel>(`${this.baseUrl}/connect/token`, body, options)
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

    signin = (model: UserModel): Observable<ResponseTokenModel> => {
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

    signout = (): void => {
        this.tokenService.clean();
        this.router.navigate(["/sign-in"]);
    }
}
