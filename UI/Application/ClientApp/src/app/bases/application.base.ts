import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs";

export class ApplicationBase {

    errorMessage: string;
    eventsSubscription: Subscription;

    constructor() { }

    resetMessages = (): void => {
        this.errorMessage = null;
    }

    subscribe = <I>(observable: Observable<I>, callbackfn?: (success: I) => void): void => {
        this.resetMessages();
        if (observable instanceof Observable) {
            observable.subscribe((success): void => {
                if (typeof callbackfn == "function") {
                    callbackfn(success);
                }
            }, (error): void => {
                this.errorMessage = this.getErrorMessage(error);
            });
        }
    }

    getErrorMessage = (error: any): string => {
        let result: string = null;
        if (error != null) {
            result = (typeof error == "string" && error.indexOf("<!DOCTYPE") == -1) ? error
                : (Array.isArray(error) && typeof error[0] == "string") ? error.join(" ")
                    : (error.errorMessage != null) ? error.errorMessage
                        : (error.message != null) ? error.message
                            : null;
        }
        return result;
    }
}
