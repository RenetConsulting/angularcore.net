import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class MessageHandlerService {

    readonly errorMessage500: string = "Oops something went wrong! :[";
    readonly errorSubject = new Subject<string>();
    readonly successSubject = new Subject<string>();

    constructor() { }

    handleError = (value: string): void => {
        this.errorSubject.next(value || this.errorMessage500);
    }

    handleSuccess = (value: string): void => value && this.successSubject.next(value);
}
