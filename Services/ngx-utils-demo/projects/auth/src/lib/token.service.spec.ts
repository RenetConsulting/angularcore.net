import { TestBed } from '@angular/core/testing';
import { StorageService } from '@renet-consulting/storage';
import { IToken } from './token';
import { TokenService } from './token.service';

describe('TokenService', () => {

    let service: TokenService;

    let storage: jasmine.SpyObj<StorageService>;
    const key = 'token';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: StorageService, useValue: jasmine.createSpyObj<StorageService>('StorageService', ['get', 'set', 'remove']) }
            ]
        });

        service = TestBed.get(TokenService);
        storage = TestBed.get(StorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    describe('valid', () => {
        it('true', () => {
            const token = { access_token: 'bob', refresh_token: 'mark' } as IToken;
            storage.get.and.returnValue(token);
            expect(service.valid).toEqual(true);
            expect(storage.get).toHaveBeenCalledWith(key);
        });
        it('storage returns empty object', () => {
            storage.get.and.returnValue({});
            expect(service.valid).toEqual(null);
            expect(storage.get).toHaveBeenCalledWith(key);
        });
        it('storage returns null', () => {
            storage.get.and.returnValue(null);
            expect(service.valid).toEqual(null);
            expect(storage.get).toHaveBeenCalledWith(key);
        });
    });
    describe('expired', () => {
        it('false, because token === null', () => {
            expect(service.expired).toEqual(false);
        });
        it('false, because expired_at more than now', () => {
            const expired_at = new Date(new Date().valueOf() + 1000).toString();
            const token = { access_token: 'bob', refresh_token: 'mark', expired_at } as IToken;
            storage.get.and.returnValue(token);
            expect(service.expired).toEqual(false);
        });
        it('true, because expired_at === undefined', () => {
            const token = { access_token: 'bob', refresh_token: 'mark' } as IToken;
            storage.get.and.returnValue(token);
            expect(service.expired).toEqual(true);
        });
        it('true, because expired_at less than now', () => {
            const expired_at = new Date(new Date().valueOf() - 1000).toString();
            const token = { access_token: 'bob', refresh_token: 'mark', expired_at } as IToken;
            storage.get.and.returnValue(token);
            expect(service.expired).toEqual(true);
        });
        it('true, because expired_at equals now', () => {
            const expired_at = new Date(new Date().valueOf()).toString();
            const token = { access_token: 'bob', refresh_token: 'mark', expired_at } as IToken;
            storage.get.and.returnValue(token);
            expect(service.expired).toEqual(true);
        });
    });
    describe('header', () => {
        it('null', () => {
            expect(service.header).toEqual(null);
        });
        it('token_type + access_token', () => {
            const token = { access_token: 'bob', refresh_token: 'mark', token_type: 'type' } as IToken;
            storage.get.and.returnValue(token);
            expect(service.header).toEqual({ authorization: `${token.token_type} ${token.access_token}` });
        });
    });
    it('setToken', () => {
        const token = { access_token: 'bob', refresh_token: 'mark', expires_in: 6 } as IToken;
        const date = new Date();
        const checkDate = new Date(date);
        service.setToken(token, date);
        expect(storage.set).toHaveBeenCalledWith(key, {
            ...token,
            expired_at: checkDate.setTime(checkDate.valueOf() + 1000 * token.expires_in).toString()
        } as IToken);
    });
    it('clean', () => {
        service.clean();
        expect(storage.remove).toHaveBeenCalledWith(key);
    });
});
