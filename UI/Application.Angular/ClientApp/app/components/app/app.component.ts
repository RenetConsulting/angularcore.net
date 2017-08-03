//
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { ApplicationBase } from '../../bases/bases'
import { LinkService } from '../../services/services';
@Component({
	selector: 'app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent extends ApplicationBase implements OnInit, OnDestroy {

	public defaultTitle: string = 'App';

	constructor(
		public router: Router,
		public activatedRoute: ActivatedRoute,
		public linkService: LinkService,
		public title: Title,
		public meta: Meta,
		@Inject('VERSION') public VERSION: string
	) {
		super();
	}

	ngOnInit() {
		console.log('VERSION', this.VERSION);
		this.routerEvents = this.router.events
			.filter((event) => {
				return event instanceof NavigationEnd;
			})
			.map(() => {
				return this.activatedRoute
			})
			.map((route) => {
				while (route.firstChild) route = route.firstChild;
				return route;
			})
			.filter(route => route.outlet === 'primary')
			.mergeMap(route => route.data)
			.subscribe((event) => {
				this.setHeadData(event);
			});
	}

	ngOnDestroy() {
		this.routerEvents.unsubscribe();
	}

	private setHeadData = (event): void => {
		// Set Title if available, otherwise leave the default Title
		const title = (event['title']) ? `${event['title']}` : `${this.defaultTitle}`;
		this.title.setTitle(title);
		const metaData = event['meta'] || [];
		const linksData = event['links'] || [];
		for (let i = 0; i < metaData.length; i++) {
			this.meta.updateTag(metaData[i]);
		}
		for (let i = 0; i < linksData.length; i++) {
			this.linkService.addTag(linksData[i]);
		}
	};
}
