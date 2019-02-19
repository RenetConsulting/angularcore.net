import { HttpErrorResponse } from '@angular/common/http';
import { MessageHandlerService } from '../../services/message-handler/message-handler.service';
import { OpenIdConnectBase } from '../open-id-connect/open-id-connect';

export class InputsErrorsBase<InputPickType> {

    errors: MapPick<InputPickType, keyof InputPickType, Array<string>>;
    private openIdConnect: OpenIdConnectBase;

    constructor(
        messageHandlerService: MessageHandlerService
    ) {
        this.openIdConnect = new OpenIdConnectBase(messageHandlerService);
    }

    handleError = (httpError?: HttpErrorResponse): void => {
        const error = httpError && httpError.error;
        this.errors = error;
        this.openIdConnect.handleError(error);
    }
}
