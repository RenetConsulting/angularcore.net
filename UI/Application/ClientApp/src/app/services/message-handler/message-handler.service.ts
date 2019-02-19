import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MessageHandlerService {

    private readonly errorMessage500: string = 'Oops something went wrong! :[';
    readonly errorSubject = new Subject<string>();
    readonly successSubject = new Subject<string>();

    constructor() { }

    private checkError = (value: string): string => value && value.length < 1000 ? value : this.errorMessage500;

    handleError = (value: string): void => this.errorSubject.next(this.checkError(value));

    handleSuccess = (value: string): void => value && this.successSubject.next(value);
}