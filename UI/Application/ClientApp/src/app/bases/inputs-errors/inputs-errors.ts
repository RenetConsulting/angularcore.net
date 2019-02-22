import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { RootStore } from '../../reducers';
import { OpenIdConnectBase } from '../open-id-connect/open-id-connect';

export class InputsErrorsBase<InputPickType> {

    errors: MapPick<InputPickType, keyof InputPickType, Array<string>>;
    private openIdConnect: OpenIdConnectBase;

    constructor(
        store: Store<RootStore>
    ) {
        this.openIdConnect = new OpenIdConnectBase(store);
    }

    handleError = (httpError?: HttpErrorResponse): void => {
        const error = httpError && httpError.error;
        this.errors = error;
        this.openIdConnect.handleError(error);
    }
}
