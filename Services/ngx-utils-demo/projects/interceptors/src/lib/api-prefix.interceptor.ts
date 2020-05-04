import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiPrefixInterceptor implements HttpInterceptor {

    constructor(
        private prefix: string
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!/^(http|https):/i.test(request.url)) {
            request = request.clone({ url: `${this.prefix}${request.url}` });
        }
        return next.handle(request);
    }
}
