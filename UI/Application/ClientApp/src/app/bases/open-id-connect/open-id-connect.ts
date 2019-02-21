import { IError } from '../../interfaces/error';
import { MessageHandlerService } from '../../services/message-handler/message-handler.service';

export class OpenIdConnectBase {

    constructor(
        private messageHandlerService: MessageHandlerService
    ) { }

    handleError = (e: IError): void => {
        if (e && e.error_description) {
            this.messageHandlerService.handleError(e);
        }
    }
}