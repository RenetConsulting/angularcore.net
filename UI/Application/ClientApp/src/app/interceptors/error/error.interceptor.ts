import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { empty, Observable, throwError } from 'rxjs';
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
            catchError(e => this.handleError(request, e))
        );
    }

    handleError = (request: HttpRequest<any>, error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
            this.messageHandlerService.handleError(error.error)
        }
        /** prevents errors in console, to return errors in stack errors use {@link return throwError(error)} */
        return request.headers.has(ALLOW_HTTP_ERROR_HEADER) ? throwError(error) : empty();
    }
}