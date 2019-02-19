import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HTTP_HEADER_NAMES } from '../../enums/http-header-names';
import { MessageHandlerService } from '../../services/message-handler/message-handler.service';

@Injectable({
    providedIn: 'root'
})
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
            if (!request.headers.has(HTTP_HEADER_NAMES.allowHttpError) || error.status >= 500) {
                this.messageHandlerService.handleError(error.error);
                return throwError(error);
            }
        }
        return throwError(error);
    }
}