import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IError } from '../../interfaces/error';

@Injectable({
    providedIn: 'root'
})
export class MessageHandlerService {

    readonly errorMessage500: string = 'Oops something went wrong! :[';
    readonly errorSubject = new Subject<IError>();
    readonly successSubject = new Subject<string>();

    constructor() { }

    private checkError = (value: string): string => value && value.length < 1000 ? value : this.errorMessage500;

    handleError = (value: IError): void =>
        this.errorSubject.next({ ...value, error_description: this.checkError(value && value.error_description) })

    handleSuccess = (value: string): void => value && this.successSubject.next(value);
}