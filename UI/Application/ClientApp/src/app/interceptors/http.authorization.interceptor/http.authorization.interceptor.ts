import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { concatMap, finalize } from "rxjs/operators";
import { AuthorizationService } from "../../services/authorization/authorization.service";
import { TokenService } from "../../services/token/token.service";

@Injectable()
export class HttpAuthorizationInterceptor implements HttpInterceptor {

    private readonly exceptionKey: string = "AllowAnonymous";
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

    /**
     * on each branch make sure that header is fresh
     */
    intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        if (this.tokenService.isValid && !request.headers.has(this.exceptionKey)) {
            if (this.tokenService.isExpired) {
                if (this.isProcessToken) {
                    const subject = new Subject<HttpRequest<any>>();
                    this.subjects.push(subject);
                    return subject.pipe(
                        concatMap(() => handler.handle(this.clone(request, { [this.authorizationKey]: this.tokenService.header })))
                    );
                }
                this.isProcessToken = true;
                return this.authorizationService.refreshToken({ [this.exceptionKey]: "true" }).pipe(
                    concatMap(() => handler.handle(this.clone(request, { [this.authorizationKey]: this.tokenService.header }))),
                    finalize(() => {
                        this.updateSubjects();
                        this.isProcessToken = false;
                    })
                );
            }
            else {
                return handler.handle(this.clone(request, { [this.authorizationKey]: this.tokenService.header }));
            }
        }
        else {
            return handler.handle(this.clone(request));
        }
    }

    updateSubjects = (): void => {
        this.subjects.forEach(i => i.next(null));
        this.subjects.length = 0;
    }

    clone = (request: HttpRequest<any>, headers?: { [key: string]: string }): HttpRequest<any> => {
        return request ? request.clone({ setHeaders: headers }) : request;
    }
}