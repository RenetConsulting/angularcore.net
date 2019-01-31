import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, concatMap } from "rxjs/operators";
import { HTTP_EXCEPTION_KEY } from "../../consts/http.exception.key";
import { AuthorizationService } from "../../services/authorization/authorization.service";
import { TokenService } from "../../services/token/token.service";

@Injectable()
export class HttpAuthorizationInterceptor implements HttpInterceptor {

    private readonly authorizationKey: string = "Authorization";
    private subjects: Array<Subject<HttpRequest<any>>> = [];
    private isProcessToken: boolean;
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

    get authorizationHeader() {
        return this.tokenService.isValid && !this.tokenService.isExpired ? { [this.authorizationKey]: this.tokenService.header } : null;
    }

    /**
     * on each branch make sure that header is fresh
     * */
    intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        if (this.tokenService.isValid && !request.headers.has(HTTP_EXCEPTION_KEY)) {
            if (this.tokenService.isExpired) {
                if (this.isProcessToken) {
                    const subject = new Subject<HttpRequest<any>>();
                    this.subjects.push(subject);
                    return subject.pipe(
                        concatMap(() => handler.handle(this.clone(request, this.authorizationHeader)))
                    );
                }
                this.isProcessToken = true;
                return this.authorizationService.refreshToken({ [HTTP_EXCEPTION_KEY]: "true" }).pipe(
                    concatMap(this.handleSuccess(request, handler)),
                    catchError(this.handleError)
                );
            }
            else {
                return handler.handle(this.clone(request, this.authorizationHeader));
            }
        }
        else {
            return handler.handle(this.clone(request));
        }
    }

    handleSuccess = (request: HttpRequest<any>, handler: HttpHandler) => (): Observable<HttpEvent<any>> => {
        this.subjects.forEach(i => i.next(null));
        this.subjects.length = 0;
        this.isProcessToken = false;
        return handler.handle(this.clone(request, this.authorizationHeader));
    }

    handleError = (error): Observable<any> => {
        this.subjects.forEach(i => i.complete());
        this.subjects.length = 0;
        this.isProcessToken = false;
        //this.errorService.errorOccurred(error, "This error is occurred during refreshing a token.");
        return throwError(error);
    }

    clone = (request: HttpRequest<any>, headers?: { [key: string]: string }): HttpRequest<any> => {
        return request ? request.clone({ setHeaders: headers }) : request;
    }
}