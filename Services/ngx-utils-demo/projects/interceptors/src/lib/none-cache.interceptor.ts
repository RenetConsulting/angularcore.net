import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export class NoneCacheInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        return handler.handle(request.clone({
            setHeaders: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                Pragma: 'no-cache'
            }
        }));
    }
}
