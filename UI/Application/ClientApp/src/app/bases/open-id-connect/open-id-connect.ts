import { MessageHandlerService } from "../../services/message.handler/message.handler.service";

export class OpenIdConnectBase {

    constructor(
        public messageHandlerService: MessageHandlerService
    ) { }

    /** handler errors that belong {@link OpenIdConnect} */
    handleUnexpectedError = (e): void => {
        const error = e && e.error_description;
        error && this.messageHandlerService.handleError(error);
    }
}