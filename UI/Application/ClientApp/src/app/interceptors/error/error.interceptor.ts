import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SetError } from '~/actions/messenger.actions';
import { HTTP_HEADER_NAMES } from '~/enums/http-header-names.type';
import { RootStore } from '~/reducers';

@Injectable({
    providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        @Inject(Store) private store: Store<RootStore>
    ) { }

    intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        return handler.handle(request).pipe(
            catchError(e => this.handleError(e, request))
        );
    }

    handleError = (error: HttpErrorResponse, request: HttpRequest<any>) => {
        if (error instanceof HttpErrorResponse) {
            if (!request.headers.has(HTTP_HEADER_NAMES.allowHttpError) || error.status >= 500) {
                this.store.dispatch(new SetError(error.error));
                return throwError(error);
            }
        }
        return throwError(error);
    }
}