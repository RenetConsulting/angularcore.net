import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import * as signalr from "@aspnet/signalr";
import { filter, map } from "rxjs/operators";

type ResponseType = 'arraybuffer' | 'blob' | 'json' | 'text';

@Injectable({
    providedIn: 'root'
})
export class HttpHubClient extends signalr.HttpClient {

    public constructor(
        @Inject(HttpClient) private http: HttpClient
    ) {
        super();
    }

    /** @inheritDoc */
    public send(request: signalr.HttpRequest): Promise<signalr.HttpResponse> {
        // Check that abort was not signaled before calling send
        if (request.abortSignal && request.abortSignal.aborted) {
            return Promise.reject(new signalr.AbortError());
        }
        if (!request.method) {
            return Promise.reject(new Error("No method defined."));
        }
        if (!request.url) {
            return Promise.reject(new Error("No url defined."));
        }
        if (!request.responseType) {
            request.responseType = 'text';
        }

        const model = new HttpRequest(request.method, request.url, request.content, {
            headers: new HttpHeaders(request.headers),
            responseType: request.responseType as ResponseType,
        })

        return this.http.request(model).pipe(
            filter(x => x.type === HttpEventType.Response),
            map((x: HttpResponse<any>) => new signalr.HttpResponse(x.status, x.statusText, x.body))
        ).toPromise();
    }
}