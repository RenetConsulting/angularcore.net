import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NGX_BASE_URL } from './base-url.token';
import { NgxTrackerHttpService } from './tracker-http.service';
import { TrackerModel } from './tracker.model';
import { NgxTrackerService } from './tracker.service';

@Component({
    selector: 'ngx-tracker',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxTrackerComponent implements OnInit, OnDestroy {

    @Input() trackerModel: TrackerModel;
    readonly subscription = new Subscription();
    url: string = null;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        @Inject(NGX_BASE_URL) private baseHref: string,
        @Inject(DOCUMENT) private doc: any,
        @Inject(NgxTrackerHttpService) private trackerHttpService: NgxTrackerHttpService,
        @Inject(NgxTrackerService) private trackerService: NgxTrackerService,
        @Inject(Router) private router: Router,
        @Inject(Title) private title: Title
    ) { }

    ngOnInit(): void {
        this.getReferer();
        this.subscription.add(this.router.events.subscribe(e => {
            switch (e.constructor) {
                case NavigationStart: this.setUrl();
                // tslint:disable-next-line: no-switch-case-fall-through
                case NavigationEnd: this.setTracker(this.router.url);
            }
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    setTracker = (url: string): void => {
        if (isPlatformBrowser(this.platformId)) {
            const model: TrackerModel = {
                ...this.trackerModel,
                ...this.trackerService.trackerModel,
                dl: `${this.baseHref}${url}`,
                dp: url,
                dr: this.url,
                dt: this.title.getTitle()
            };
            this.trackerHttpService.addTracker(model).subscribe();
        }
        this.url = null;
    }

    setUrl = (): void => {
        if (this.url === null) {
            this.url = `${this.baseHref}${this.router.url}`;
        }
    }

    getReferer = (): void => {
        if (isPlatformBrowser(this.platformId)) {
            this.url = this.doc.referrer || undefined;
        }
    }
}
