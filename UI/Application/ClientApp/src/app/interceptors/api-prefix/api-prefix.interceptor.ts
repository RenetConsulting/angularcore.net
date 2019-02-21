import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { BASE_URL } from '@app/tokens/base-url.token';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiPrefixInterceptor implements HttpInterceptor {

    private baseUrl: string;

    constructor(
        @Inject(Injector) injector: Injector
    ) {
        this.baseUrl = injector.get(BASE_URL);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!/^(http|https):/i.test(request.url)) {
            request = request.clone({ url: this.baseUrl + request.url });
        }
        return next.handle(request);
    }
}