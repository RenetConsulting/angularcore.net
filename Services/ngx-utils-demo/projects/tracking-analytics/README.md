# Tracking-Analytics

[![NPM version](https://img.shields.io/npm/v/@renet-consulting/ngx-tracking-analytics.svg)](https://www.npmjs.com/package/@renet-consulting/ngx-tracking-analytics) 
[![NPM downloads](https://img.shields.io/npm/dm/@renet-consulting/ngx-tracking-analytics.svg)](https://www.npmjs.com/package/@renet-consulting/ngx-tracking-analytics)
[![MIT license](http://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

The application is custom implementation [Google Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/) to handle a behavior of a user.
It's only the front-end part of the tracking user's data, see the back-end part on the [TODO-add a link](https://google.com).

## Installation

```sh
npm install @renet-consulting/ngx-tracking-analytics --save
```

### Include it in your application
1. Add `NgxTrackerModule` to your root NgModule passing an config with a loader `TrackerHttpService`
```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { NgxTrackerModule } from '@renet-consulting/ngx-tracking-analytics';

const ROUTES: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent }
];

export function trackerHttpServiceFactory(trackerService: NgxTrackerService, http: HttpClient): TrackerHttpService {
    return new TrackerHttpService(trackerService, http);
}

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(ROUTES),

        // added to imports
        NgxTrackerModule.forRoot({
			loader: { provide: NgxTrackerHttpService, useFactory: (trackerHttpServiceFactory), deps: [NgxTrackerService, HttpClient] },
			baseUrl: { provide: NGX_BASE_URL, useValue: window.location.host },
		}),
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
})
```
2. Where the `TrackerHttpService` is:

```ts
@Injectable()
export class TrackerHttpService {

    public readonly keyId: string = "Encrypt-Key";
    public readonly ivId: string = "Encrypt-Iv";

    constructor(
        private trackerService: NgxTrackerService,
        private http: HttpClient,
    ) { }

    public addTracker = (item: TrackerModel): Observable<any> => {
        const keyId: string = this.trackerService.randomValue;
        const ivId: string = this.trackerService.randomValue;
        const value: string = this.trackerService.encrypt(item, keyId, ivId);
        return this.http
            .get(`api/ra?model=${value}`, {
                responseType: "text",
                headers: new HttpHeaders({
                    [this.keyId]: keyId,
                    [this.ivId]: ivId
                })
            });
    }
}
```

## Usage
### Collect basic data

```ts
import { Component } from "@angular/core";

@Component({
    selector: "app",
    template: `
	<router-outlet></router-outlet>
	<ngx-tracker></ngx-tracker>
	`
})
export class AppComponent {
    
	constructor() { }
}
```

## Release v14.0.0
Converted project to Angular v14

## Release v9.0.0
Converted project to Angular v9
