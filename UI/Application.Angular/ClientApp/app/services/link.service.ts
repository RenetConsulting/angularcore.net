//
import { Injectable, RendererFactory2, ViewEncapsulation, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

export declare type LinkDefinition = {
	charset?: string;
	crossorigin?: string;
	href?: string;
	hreflang?: string;
	media?: string;
	rel?: string;
	rev?: string;
	sizes?: string;
	target?: string;
	type?: string;
} & {
		[prop: string]: string;
	};

@Injectable()
export class LinkService {

	constructor(
		private rendererFactory: RendererFactory2,
		@Inject(DOCUMENT) private document,
	) { }

	addTag = (tag: LinkDefinition): void => {
		try {
			const renderer = this.rendererFactory.createRenderer(this.document, {
				id: '-1',
				encapsulation: ViewEncapsulation.None,
				styles: [],
				data: {}
			});
			const link = renderer.createElement('link');
			const head = this.document.head;
			if (head === null) {
				throw new Error('<head> not found within DOCUMENT.');
			}
			Object.keys(tag).forEach((prop: string) => {
				return renderer.setAttribute(link, prop, tag[prop]);
			});
			// [TODO]: get them to update the existing one (if it exists) ?
			renderer.appendChild(head, link);
		} catch (e) {
			console.error('Error within linkService : ', e);
		}
	};

}


