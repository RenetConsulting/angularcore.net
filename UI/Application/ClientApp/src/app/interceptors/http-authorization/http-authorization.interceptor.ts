import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { HTTP_HEADER_NAMES } from '../../enums/http-header-names.type';
import { AuthorizationService } from '../../services/authorization/authorization.service';
import { TokenService } from '../../services/token/token.service';

@Injectable({
    providedIn: 'root'
})
export class HttpAuthorizationInterceptor implements HttpInterceptor {

    private subjects: Array<Subject<HttpRequest<any>>> = [];
    private loading: boolean;

    constructor(
        @Inject(AuthorizationService) private authorizationService: AuthorizationService,
        @Inject(TokenService) private tokenService: TokenService,
    ) { }

    /** on each branch make sure that header is fresh */
    intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        if (this.tokenService.valid && !request.headers.has(HTTP_HEADER_NAMES.allowAnonymous)) {
            if (this.tokenService.expired && !request.headers.has(HTTP_HEADER_NAMES.allowExpiredToken)) {
                if (this.loading) {
                    const subject = new Subject<HttpRequest<any>>();
                    this.subjects.push(subject);
                    return subject.pipe(
                        concatMap(() => handler.handle(this.clone(request, this.tokenService.header))));
                }
                this.loading = true;
                return handler.handle(this.clone(this.authorizationService.refreshRequest, this.tokenService.header)).pipe(
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
        this.loading = false;
        return handler.handle(this.clone(request, this.tokenService.header));
    }

    /** the error handles by {@link ErrorInterceptor} */
    handleError = (): Observable<any> => {
        this.subjects.forEach(i => i.complete());
        this.subjects.length = 0;
        this.loading = false;
        return EMPTY;
    }

    clone = (request: HttpRequest<any>, headers?: { [key: string]: string }): HttpRequest<any> =>
        request ? request.clone({ setHeaders: { ...headers } }) : request
}
