import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, finalize, mergeMap } from 'rxjs/operators';
import { AuthDefaultOptions } from './auth-default-options';
import { HTTP_HEADER_NAMES } from './http-header-names.type';
import { HTTP_HEADERS } from './http-headers';
import { IToken } from './token';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

    /** a set of requests that were posting during refreshing a token */
    readonly subjects: Array<Subject<HttpRequest<any>>> = [];
    /** a flag of process the refreshing a token */
    loading: boolean;

    constructor(
        @Inject(TokenService) private token: TokenService,
        @Inject(NgxHttpParamsService) private params: NgxHttpParamsService,
        @Inject(AuthDefaultOptions) private options: AuthDefaultOptions,
    ) { }

    /** request to refresh an expired token */
    get request() {
        const refresh_token = this.token.get('refresh_token');
        const item: IToken = {
            grant_type: 'refresh_token',
            scope: 'offline_access',
            refresh_token,
        };
        const body = this.params.map(item).toString();
        return new HttpRequest('POST', this.options.apiRefreshToken, body, {
            headers: new HttpHeaders({ ...HTTP_HEADERS.contentTypeUrlencoded }),
        });
    }

    intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        if (this.token.valid && !request.headers.has(HTTP_HEADER_NAMES.allowAnonymous)) {
            if (this.token.expired && !request.headers.has(HTTP_HEADER_NAMES.allowExpiredToken)) {
                if (this.loading) {
                    const subject = new Subject<HttpRequest<any>>();
                    this.subjects.push(subject);
                    return subject.pipe(mergeMap(() => handler.handle(this.setAuth(request))));
                }
                this.loading = true;
                return handler.handle(this.request).pipe(
                    mergeMap(i => i instanceof HttpResponse ? this.handleSuccess(request, handler, i.body) : of(i)),
                    catchError(this.handleError),
                    finalize(this.handleFinalize)
                );
            }
            else {
                return handler.handle(this.setAuth(request));
            }
        }
        else {
            return handler.handle(request);
        }
    }

    handleSuccess = (request: HttpRequest<any>, handler: HttpHandler, token: IToken) => {
        this.token.setToken(token);
        this.subjects.forEach(i => i.next(null));
        return handler.handle(this.setAuth(request));
    }

    /** clean token to prevent cycling the error */
    handleError = (e) => {
        this.token.clean();
        return throwError(e);
    }

    handleFinalize = (): void => {
        this.subjects.forEach(i => i.complete());
        this.subjects.length = 0;
        this.loading = false;
    }

    setAuth = (request: HttpRequest<any>) => request ? request.clone({ setHeaders: this.token.header }) : request;
}
