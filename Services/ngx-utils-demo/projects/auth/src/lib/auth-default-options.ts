import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthDefaultOptions {

    readonly apiRefreshToken = '/connect/token';
    readonly apiSignin = '/connect/token';
    readonly apiSignout = '/connect/signout';
    readonly apiSignup = '/api/account/register';

    constructor() { }
}
