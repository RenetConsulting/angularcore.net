import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class MessageHandlerService {

    readonly errorMessage500: string = "Oops something went wrong! :[";
    readonly subject = new Subject<string>();

    constructor() { }

    handleError = (value: string): void => {
        this.subject.next(value || this.errorMessage500);
    }
}
