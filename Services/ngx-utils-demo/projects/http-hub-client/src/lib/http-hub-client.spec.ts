import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync, TestBed } from '@angular/core/testing';
import * as signalr from '@aspnet/signalr';
import { of } from 'rxjs';
import { HttpHubClient } from './http-hub-client';

describe('HttpHubClient', () => {

    let service: HttpHubClient;

    let http: HttpClient;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(HttpHubClient);
        http = TestBed.inject(HttpClient);
    });

    it('toBeDefined', () => {
        expect(service).toBeDefined();
    });
    describe('send', () => {
        it('abortSignal', waitForAsync(() => {
            service.send({ abortSignal: { aborted: true } as signalr.AbortSignal }).then(() => fail('should be an error'), e => {
                expect(e).toEqual(new Error('An abort occurred.'));
            });
        }));
        it('method equals null', waitForAsync(() => {
            service.send({ method: null }).then(() => fail('should be an error'), e => {
                expect(e).toEqual(new Error('No method defined.'));
            });
        }));
        it('url equals null', waitForAsync(() => {
            service.send({ method: 'POST', url: null }).then(() => fail('should be an error'), e => {
                expect(e).toEqual(new Error('No url defined.'));
            });
        }));

        describe('has data to call request', () => {

            let request: signalr.HttpRequest;
            let response: HttpResponse<any>;

            beforeEach(() => {
                response = { type: HttpEventType.Response, body: '{bob:"bob"}', statusText: 'Ok', status: 200 } as HttpResponse<any>;
                request = { method: 'POST', url: 'https://google.com', responseType: 'blob' };
                spyOn(http, 'request').and.returnValue(of(response));
            });

            it('should override responseType to `text`', waitForAsync(() => {
                request = { method: 'POST', url: 'https://google.com', responseType: '' };
                service.send(request).then(() => {
                    expect(http.request).toHaveBeenCalledWith(new HttpRequest(request.method, request.url, request.content, {
                        headers: new HttpHeaders(request.headers),
                        responseType: 'text',
                    }));
                }, () => fail('should be a success'));
            }));
            it('should call with origin responseType', waitForAsync(() => {
                service.send(request).then(() => {
                    expect(http.request).toHaveBeenCalledWith(new HttpRequest(request.method, request.url, request.content, {
                        headers: new HttpHeaders(request.headers),
                        responseType: request.responseType as any,
                    }));
                }, () => fail('should be a success'));
            }));
            it('should call with origin responseType', waitForAsync(() => {
                service.send(request).then(() => {
                    expect(http.request).toHaveBeenCalledWith(new HttpRequest(request.method, request.url, request.content, {
                        headers: new HttpHeaders(request.headers),
                        responseType: request.responseType as any,
                    }));
                }, () => fail('should be a success'));
            }));
            it('response should be right', waitForAsync(() => {
                service.send(request).then(r => {
                    expect(r).toEqual(new signalr.HttpResponse(response.status, response.statusText, response.body));
                }, () => fail('should be a success'));
            }));
        });
    });
});
