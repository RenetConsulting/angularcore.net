import { MessageHandlerService } from '../../services/message.handler/message.handler.service';

export class OpenIdConnectBase {

    constructor(
        private messageHandlerService: MessageHandlerService
    ) { }

    /** handler errors that belong {@link OpenIdConnect} */
    handleError = (e): void => {
        const error = e && e.error_description;
        if (error) {
            this.messageHandlerService.handleError(error);
        }
    }
}