//
import { Subscription } from 'RxJs/Subscription';

export class ApplicationBase {

	public successMessage: string = null;
	public errorMessage: string = null;

	public routeParams: Subscription;
	public routerEvents: Subscription;
	public routeQueryParams: Subscription;

	constructor() {}

	public resetMessages = (): void => {
		this.successMessage = null;
		this.errorMessage = null;
	};

	test = (...args: Array<any>) => {
		console.log(args)
	}
}