import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { OpenIdConnectRequestModel } from "../../models/open.id.connect.request.model";
import { AuthorizationService } from "../authorization/authorization.service";
import { TokenService } from "../token/token.service";

@Injectable()
export class HttpAuthorizationInterceptor implements HttpInterceptor {

    private readonly exceptionKey: string = "AllowAnonymous";
    private readonly authorizationKey: string = "Authorization";
    private authorizationService: AuthorizationService;
    private tokenService: TokenService;

    constructor(
        @Inject(Injector) injector: Injector
    ) {
        /**
         * the bug fix for next error:
         * Cannot instantiate cyclic dependency! InjectionToken_HTTP_INTERCEPTORS ("[ERROR ->]"): in NgModule AppServerModule in ./AppServerModule@-1:-1
         */
        this.authorizationService = injector.get(AuthorizationService);
        this.tokenService = injector.get(TokenService);
    }

    get refreshToken(): Observable<any> {
        let model: OpenIdConnectRequestModel = new OpenIdConnectRequestModel({
            grant_type: "refresh_token",
            scope: "offline_access",
            refresh_token: this.tokenService.valueByProperty("refresh_token")
        } as OpenIdConnectRequestModel);
        return this.authorizationService.getToken(model, { [this.exceptionKey]: "true" });
    }

    intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        const headers = {
            "Cache-Control": "no-store, no-cache, must-revalidate",
            "Pragma": "no-cache"
        };
        if (this.tokenService.isValid && !request.headers.has(this.exceptionKey)) {
            if (this.tokenService.isExpired) {
                return this.refreshToken.concatMap((): Observable<HttpEvent<any>> => {
                    headers[this.authorizationKey] = this.tokenService.header;
                    return handler.handle(this.getHttpRequest(request, headers));
                });
            }
            else {
                headers[this.authorizationKey] = this.tokenService.header;
                return handler.handle(this.getHttpRequest(request, headers));
            }
        }
        else {
            return handler.handle(this.getHttpRequest(request, headers));
        }
    }

    getHttpRequest = (request: HttpRequest<any>, headers: { [key: string]: string }): HttpRequest<any> => {
        let result: HttpRequest<any> = request;
        if (request != null) {
            request.headers.keys().forEach((key): void => {
                headers[key] = request.headers.get(key);
            });
            result = request.clone({
                headers: new HttpHeaders(headers)
            });
        }
        return result;
    }
}
