import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ALLOW_HTTP_ERROR_HEADER } from '../../consts/allow.http.error.header';
import { MessageHandlerService } from '../../services/message.handler/message.handler.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    private messageHandlerService: MessageHandlerService;

    constructor(
        @Inject(Injector) injector: Injector
    ) {
        this.messageHandlerService = injector.get(MessageHandlerService);
    }

    intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        return handler.handle(request).pipe(
            catchError(e => this.handleError(e, request))
        );
    }

    handleError = (error: HttpErrorResponse, request: HttpRequest<any>) => {
        if (error instanceof HttpErrorResponse) {
            if (!request.headers.has(ALLOW_HTTP_ERROR_HEADER) || error.status >= 500) {
                this.messageHandlerService.handleError(error.error);
                return EMPTY;
            }
        }
        return throwError(error);
    }
}