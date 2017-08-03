import { Component } from '@angular/core';

@Component({
	selector: 'fetchdata',
	templateUrl: './fetchdata.component.html'
})
export class FetchDataComponent {
	itemList: Array<any> = []
	constructor() {}
}
