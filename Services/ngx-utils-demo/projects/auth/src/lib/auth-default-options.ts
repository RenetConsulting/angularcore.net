import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthDefaultOptions {

    readonly apiRefreshToken = '/connect/token';
    readonly apiSignin = '/connect/token';
    readonly apiSignup = '/api/account/register';
    readonly apiSignout = '/connect/signout';

    constructor() { }
}
