import { Inject, Injectable } from '@angular/core';
import { CanActivateChild } from '@angular/router';
import { AuthorizationService } from '../services/authorization/authorization.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard implements CanActivateChild {

    constructor(
        @Inject(AuthorizationService) private authorizationService: AuthorizationService
    ) { }

    canActivateChild(): boolean {
        return this.authorizationService.isAuthenticated;
    }
}
