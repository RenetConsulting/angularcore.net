import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { HTTP_HEADER_NAMES } from '../../enums/http-header-names';
import { AuthorizationService } from '../../services/authorization/authorization.service';
import { MessageHandlerService } from '../../services/message-handler/message-handler.service';
import { TokenService } from '../../services/token/token.service';

@Injectable({
    providedIn: 'root'
})
export class HttpAuthorizationInterceptor implements HttpInterceptor {

    private subjects: Array<Subject<HttpRequest<any>>> = [];
    private isProcessToken: boolean;
    private authorizationService: AuthorizationService;
    private tokenService: TokenService;
    private messageHandlerService: MessageHandlerService;

    constructor(
        @Inject(Injector) injector: Injector
    ) {
        /**
         * the bug fix for next error:
         * Cannot instantiate cyclic dependency! InjectionToken_HTTP_INTERCEPTORS ('[ERROR ->]'):
         * in NgModule AppServerModule in ./AppServerModule@-1:-1
         */
        this.authorizationService = injector.get(AuthorizationService);
        this.messageHandlerService = injector.get(MessageHandlerService);
        this.tokenService = injector.get(TokenService);
    }

    /** on each branch make sure that header is fresh */
    intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        if (this.tokenService.valid && !request.headers.has(HTTP_HEADER_NAMES.allowAnonymous)) {
            if (this.tokenService.expired && !request.headers.has(HTTP_HEADER_NAMES.allowExpiredToken)) {
                if (this.isProcessToken) {
                    const subject = new Subject<HttpRequest<any>>();
                    this.subjects.push(subject);
                    return subject.pipe(
                        concatMap(() => handler.handle(this.clone(request, this.tokenService.header))));
                }
                this.isProcessToken = true;
                return handler.handle(this.authorizationService.refreshRequest).pipe(
                    concatMap(i => i instanceof HttpResponse ? this.concatRequests(request, handler) : of(i)),
                    catchError(this.handleError),
                );
            }
            else {
                return handler.handle(this.clone(request, this.tokenService.header));
            }
        }
        else {
            return handler.handle(this.clone(request));
        }
    }

    concatRequests = (request: HttpRequest<any>, handler: HttpHandler) => (): Observable<HttpEvent<any>> => {
        this.subjects.forEach(i => { i.next(null); });
        this.subjects.length = 0;
        this.isProcessToken = false;
        return handler.handle(this.clone(request, this.tokenService.header));
    }

    handleError = (error): Observable<any> => {
        this.subjects.forEach(i => i.complete());
        this.subjects.length = 0;
        this.isProcessToken = false;
        this.messageHandlerService.handleError(error.error && error.error.error_description);
        return EMPTY;
    }

    clone = (request: HttpRequest<any>, headers?: { [key: string]: string }): HttpRequest<any> =>
        request ? request.clone({ setHeaders: { ...headers } }) : request
}
