import { Route } from '@angular/router';
import {
	CounterComponent,
	FetchDataComponent,
	HomeComponent,
	NotFoundComponent
} from './components/components';

export const ROUTES: Route[] = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{
		path: 'home',
		component: HomeComponent,
		data: {
			title: 'Home',
			meta: [{ name: 'description', content: 'Home Description Meta tag!' }]
		}
	},
	{
		path: 'counter',
		component: CounterComponent,
		data: {
			title: 'Counter',
			meta: [{ name: 'description', content: 'Counter page Description!' }]
		}
	},
	{
		path: 'fetch-data',
		component: FetchDataComponent,
		data: {
			title: 'Fetch Data',
			meta: [{ name: 'description', content: 'Fetch Data page Description!' }]
		}
	},
	{
		path: 'not-found',
		component: NotFoundComponent,
		data: {
			title: 'Not Found',
			meta: [{ name: 'description', content: 'Not Found page Description!' }]
		}
	},
	{ path: '**', redirectTo: 'not-found' }
];