import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class HttpHandlerService {

    private readonly errorMessage500: string = "Oops something went wrong! :[";

    constructor() { }

    handleError = (error: HttpErrorResponse): Observable<any> => {
        console.log(error);
        if (error.status == 200 || error.status >= 500) {
            return Observable.throw(this.errorMessage500);
        }
        if (typeof error.error == "string" && /^\<\!DOCTYPE/i.test(error.error)) {
            return Observable.throw(this.errorMessage500);
        }
        return Observable.throw(error.error);
    }
}
