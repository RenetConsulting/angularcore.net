import { TestBed } from '@angular/core/testing';
import { LOCAL_STORAGE } from '../../tokens/local-storage.token';
import { SESSION_STORAGE } from '../../tokens/session-storage.token';
import { StorageService } from './storage.service';

interface IStorageSpy {
    getItem: jasmine.Spy
    setItem: jasmine.Spy
    removeItem: jasmine.Spy
}

describe('StorageService', () => {

    let service: StorageService;
    let localStorage: IStorageSpy;
    let sessionStorage: IStorageSpy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: LOCAL_STORAGE, useValue: jasmine.createSpyObj('LOCAL_STORAGE', ['getItem', 'setItem', 'removeItem']) },
                { provide: SESSION_STORAGE, useValue: jasmine.createSpyObj('SESSION_STORAGE', ['getItem', 'setItem', 'removeItem']) }
            ]
        });
        service = TestBed.get(StorageService);
        localStorage = TestBed.get(LOCAL_STORAGE);
        sessionStorage = TestBed.get(SESSION_STORAGE);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    describe('setStorage', () => {
        it('localSorage', () => {
            const value = true;
            service.setStorage(value);
            expect(localStorage.setItem).toHaveBeenCalledWith('storage.iru', new String(value));
        })
        it('sessionStorage', () => {
            const value = false;
            service.setStorage(value);
            expect(localStorage.setItem).toHaveBeenCalledWith('storage.iru', new String(value));
        })
    })
    it('get', () => {
        const key = 'bob';
        const value = 'bob';
        sessionStorage.getItem.and.returnValue(value);
        expect(service.get(key, sessionStorage)).toEqual(value)
        expect(sessionStorage.getItem).toHaveBeenCalledWith(key);
    })
    describe('set', () => {
        it('set string value', () => {
            const key = 'bob';
            const value = 'bob';
            service.set(key, value, sessionStorage)
            expect(sessionStorage.setItem).toHaveBeenCalledWith(key, value);
        })
        it('set not string value', () => {
            const key = 'bob';
            const value = { title: 'bob' };
            service.set(key, value, sessionStorage)
            expect(sessionStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
        })
    })
});
