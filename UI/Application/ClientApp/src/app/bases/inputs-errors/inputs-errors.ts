import { MessageHandlerService } from "../../services/message.handler/message.handler.service";
import { OpenIdConnectBase } from "../open-id-connect/open-id-connect";

export class InputsErrorsBase<InputPickType> extends OpenIdConnectBase {

    errors: MapPick<InputPickType, keyof InputPickType, Array<string>>;

    constructor(
        messageHandlerService: MessageHandlerService
    ) {
        super(messageHandlerService);
    }

    handleInputsErrors = (httpError): void => {
        const error = httpError && httpError.error;
        this.errors = error;
        this.handleUnexpectedError(error);
    }
}
