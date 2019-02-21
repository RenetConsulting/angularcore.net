import { TestBed } from '@angular/core/testing';
import { AuthorizationService } from '../../services/authorization/authorization.service';
import { AuthenticationGuard } from './authentication.guard';

describe('AuthenticationGuard', () => {

    let guard: AuthenticationGuard;

    const mockAuthorizationService = { authorized: true } as AuthorizationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthenticationGuard,
                { provide: AuthorizationService, useValue: mockAuthorizationService }
            ]
        });
        guard = TestBed.get(AuthenticationGuard);
    });

    it('should toBeTruthy', () => {
        expect(guard).toBeTruthy();
    });
    it('canActivate should return value of isAuthenticated', () => {
        expect(guard.canActivate()).toEqual(mockAuthorizationService.authorized);
    });
});
