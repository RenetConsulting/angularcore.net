import { TestBed } from '@angular/core/testing';
import { AuthService, IToken, TokenService } from '@renet-consulting/auth/src/public-api';
import { of, throwError } from 'rxjs';
import { ExternalTokenHandlerService } from './external-token-handler.service';

describe('ExternalTokenHandlerService', () => {

    let service: ExternalTokenHandlerService;

    let authService: jasmine.SpyObj<AuthService>;
    let tokenService: jasmine.SpyObj<TokenService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: jasmine.createSpyObj<AuthService>('AuthService', ['getToken']) },
                { provide: TokenService, useValue: jasmine.createSpyObj<TokenService>('TokenService', ['setToken']) }
            ]
        });

        service = TestBed.inject(ExternalTokenHandlerService);
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('handle', () => {

        const state = 'google';
        const access_token = 'bob';
        const token = { grant_type: 'external_identity_token', access_token, state, scope: 'offline_access' };
        const result = {} as IToken;

        it('success', () => {
            authService.getToken.and.returnValue(of(result));
            service.handle(access_token, state).subscribe();
            expect(authService.getToken).toHaveBeenCalledWith(token);
            expect(tokenService.setToken).toHaveBeenCalledWith(result);
        });
        it('error', () => {
            const error = { error: state };
            authService.getToken.and.returnValue(throwError(error));

            service.handle(access_token, state).subscribe(
                () => fail('should have failed with error'),
                () => {
                    expect(authService.getToken).toHaveBeenCalledWith(token);
                    expect(tokenService.setToken).not.toHaveBeenCalled();
                }
            );
        });
    });
});
