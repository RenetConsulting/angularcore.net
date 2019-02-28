import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, mergeMap } from 'rxjs/operators';
import { HTTP_HEADERS } from '../../consts/http-headers';
import { HTTP_HEADER_NAMES } from '../../enums/http-header-names.type';
import { IConnectToken } from '../../interfaces/connect-token';
import { IToken } from '../../interfaces/token';
import { TokenService } from '../../services/token/token.service';
import { ToolsService } from '../../services/tools/tools.service';

@Injectable({
    providedIn: 'root'
})
export class HttpAuthorizationInterceptor implements HttpInterceptor {

    private subjects: Array<Subject<HttpRequest<any>>> = [];
    private loading: boolean;

    constructor(
        @Inject(TokenService) private tokenService: TokenService,
        @Inject(ToolsService) private toolsService: ToolsService,
    ) { }

    get refreshRequest() {
        const refresh_token = this.tokenService.get('refresh_token');
        const item: IConnectToken = {
            grant_type: 'refresh_token',
            scope: 'offline_access',
            refresh_token,
        };
        const body = this.toolsService.getQuery(item).replace(/^\?/, '');
        return new HttpRequest('POST', `/connect/refresh`, body, {
            headers: new HttpHeaders({ ...HTTP_HEADERS.contentTypeUrlencoded }),
        });
    }

    /** on each branch make sure that header is fresh */
    intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        if (this.tokenService.valid && !request.headers.has(HTTP_HEADER_NAMES.allowAnonymous)) {
            if (this.tokenService.expired && !request.headers.has(HTTP_HEADER_NAMES.allowExpiredToken)) {
                if (this.loading) {
                    const subject = new Subject<HttpRequest<any>>();
                    this.subjects.push(subject);
                    return subject.pipe(
                        mergeMap(() => handler.handle(this.setAuthorization(request))));
                }
                this.loading = true;
                return handler.handle(this.refreshRequest).pipe(
                    mergeMap(i => i instanceof HttpResponse ? this.handleSuccess(request, handler, i.body) : of(i)),
                    catchError(this.handleError),
                    finalize(this.handleFinalize)
                );
            }
            else {
                return handler.handle(this.setAuthorization(request));
            }
        }
        else {
            return handler.handle(request);
        }
    }

    handleSuccess = (request: HttpRequest<any>, handler: HttpHandler, token: IToken): Observable<HttpEvent<any>> => {
        this.tokenService.setToken(token);
        this.subjects.forEach(i => i.next(null));
        return handler.handle(this.setAuthorization(request));
    }

    /** the error handles by {@link ErrorInterceptor} */
    handleError = (): Observable<any> => EMPTY;

    handleFinalize = (): void => {
        this.subjects.forEach(i => i.complete());
        this.subjects.length = 0;
        this.loading = false;
    }

    setAuthorization = (request: HttpRequest<any>): HttpRequest<any> => {
        return request ? request.clone({ setHeaders: this.tokenService.header }) : request
    }
}
