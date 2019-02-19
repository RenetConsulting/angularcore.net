import { Inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthorizationService } from '../../services/authorization/authorization.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

    constructor(
        @Inject(AuthorizationService) private authorizationService: AuthorizationService
    ) { }

    canActivate(): boolean {
        return this.authorizationService.isAuthenticated;
    }
}
