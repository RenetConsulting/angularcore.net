import { TestBed } from '@angular/core/testing';
import { AccessService } from '~/services/access/access.service';
import { AuthenticationGuard } from './authentication.guard';

describe('AuthenticationGuard', () => {

    let guard: AuthenticationGuard;

    const mockAccessService = { authorized: true } as AccessService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthenticationGuard,
                { provide: AccessService, useValue: mockAccessService }
            ]
        });
        guard = TestBed.get(AuthenticationGuard);
    });

    it('should toBeTruthy', () => {
        expect(guard).toBeTruthy();
    });
    it('canActivate should return value of isAuthenticated', () => {
        expect(guard.canActivate()).toEqual(mockAccessService.authorized);
    });
});
