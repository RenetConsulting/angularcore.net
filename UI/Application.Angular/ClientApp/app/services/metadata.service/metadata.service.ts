import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Event, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class MetadataService {

    public defaultTitle: string = 'angular.net';

    constructor(
        private titleService: Title,
        private metaService: Meta,
    ) { }

    public setMetadata = (event: Event, snapshot: ActivatedRouteSnapshot): void => {
        if (event instanceof NavigationEnd && snapshot != null) {
            const data = snapshot.data;
            const title = (data.title != null) ? data.title : this.defaultTitle;
            this.titleService.setTitle(title);
            const metaData = (Array.isArray(data.meta)) ? data.meta : [];
            for (let index = 0; index < metaData.length; index++) {
                this.metaService.updateTag(metaData[index]);
            }
        }
    };
}