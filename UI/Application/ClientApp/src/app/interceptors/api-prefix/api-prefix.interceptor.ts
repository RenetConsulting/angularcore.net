import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BASE_URL } from '@app/tokens/base-url.token';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiPrefixInterceptor implements HttpInterceptor {


    constructor(
        @Inject(BASE_URL) private baseUrl: string
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!/^(http|https):/i.test(request.url)) {
            request = request.clone({ url: `${this.baseUrl}/${request.url}` });
        }
        return next.handle(request);
    }
}