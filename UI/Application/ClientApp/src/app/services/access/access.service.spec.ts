import { TestBed } from '@angular/core/testing';
import { TokenService } from '../token/token.service';
import { AccessService } from './access.service';

describe('AccessService', () => {

    let service: AccessService;
    let tokenService: TokenService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.get(AccessService);
        tokenService = TestBed.get(TokenService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should be created', () => {
        const value = true;
        Object.defineProperty(tokenService, 'valid', { get: () => value });
        expect(service.authorized).toEqual(value);
    });
});
