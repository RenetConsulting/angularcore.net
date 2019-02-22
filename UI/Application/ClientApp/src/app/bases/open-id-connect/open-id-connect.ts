import { Store } from '@ngrx/store';
import { SetError } from '../../actions/error.actions';
import { IError } from '../../interfaces/error';
import { RootStore } from '../../reducers';

export class OpenIdConnectBase {

    constructor(
        private store: Store<RootStore>
    ) { }

    handleError = (e: IError): void => {
        if (e && e.error_description) {
            this.store.dispatch(new SetError(e));
        }
    }
}