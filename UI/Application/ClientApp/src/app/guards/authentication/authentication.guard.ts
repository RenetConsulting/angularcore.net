import { Inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AccessService } from '../../services/access/access.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

    constructor(
        @Inject(AccessService) private accessService: AccessService
    ) { }

    canActivate(): boolean {
        return this.accessService.authorized;
    }
}
