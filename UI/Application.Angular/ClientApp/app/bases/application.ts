//
import { Subscription } from 'RxJs/Subscription';

export class ApplicationBase {

	public successMessage: string;
	public errorMessage: string;

	public routerParams: Subscription;
	public routerEvents: Subscription;
	public routerQueryParams: Subscription;

	constructor() {}

	public resetMessages = (): void => {
		this.successMessage = null;
		this.errorMessage = null;
	};

}