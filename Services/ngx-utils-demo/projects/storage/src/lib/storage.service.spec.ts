import { TestBed } from '@angular/core/testing';
import { LOCAL_STORAGE } from './local-storage.token';
import { SESSION_STORAGE } from './session-storage.token';
import { StorageService } from './storage.service';

describe('StorageService', () => {

    let service: StorageService;
    let localStorage: jasmine.SpyObj<Storage>;
    let sessionStorage: jasmine.SpyObj<Storage>;
    const storageKey = 'sessional';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: LOCAL_STORAGE, useValue: jasmine.createSpyObj('LOCAL_STORAGE', ['getItem', 'setItem', 'removeItem']) },
                { provide: SESSION_STORAGE, useValue: jasmine.createSpyObj('SESSION_STORAGE', ['getItem', 'setItem', 'removeItem']) }
            ]
        });
        service = TestBed.inject(StorageService);
        localStorage = TestBed.inject(LOCAL_STORAGE);
        sessionStorage = TestBed.inject(SESSION_STORAGE);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should set default storage', () => {
        const value = true;
        localStorage.getItem.and.returnValue(`${value}`);
        service = new StorageService(localStorage, sessionStorage);
        expect(localStorage.getItem).toHaveBeenCalledWith(storageKey);
        expect(localStorage.setItem).toHaveBeenCalledWith(storageKey, `${value}`);
    });
    it('by default has to be localStorage', () => {
        const value = null;
        localStorage.getItem.and.returnValue(value);
        service = new StorageService(localStorage, sessionStorage);
        service.set('bob', 'mark');
        expect(localStorage.setItem).toHaveBeenCalledWith('bob', 'mark');
        expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });
    it('should be sessionStorage', () => {
        const value = true;
        localStorage.getItem.and.returnValue(`${value}`);
        service = new StorageService(localStorage, sessionStorage);
        service.set('bob', 'mark');
        expect(sessionStorage.setItem).toHaveBeenCalledWith('bob', 'mark');
        expect(localStorage.setItem).toHaveBeenCalledWith(storageKey, `${value}`);
    });
    describe('setStorage', () => {
        it('localSorage', () => {
            const value = true;
            service.setStorage(value);
            expect(localStorage.setItem).toHaveBeenCalledWith(storageKey, `${value}`);
        });
        it('sessionStorage', () => {
            const value = false;
            service.setStorage(value);
            expect(localStorage.setItem).toHaveBeenCalledWith(storageKey, `${value}`);
        });
    });
    describe('get', () => {
        it('null', () => {
            const key = 'bob';
            const value = null;
            sessionStorage.getItem.and.returnValue(value);
            expect(service.get(key, sessionStorage)).toEqual(value);
            expect(sessionStorage.getItem).toHaveBeenCalledWith(key);
        });
        it('string', () => {
            const key = 'bob';
            const value = 'bob';
            sessionStorage.getItem.and.returnValue(value);
            expect(service.get(key, sessionStorage)).toEqual(value);
            expect(sessionStorage.getItem).toHaveBeenCalledWith(key);
        });
        it('number', () => {
            const key = 'bob';
            const value = 1;
            sessionStorage.getItem.and.returnValue(`${value}`);
            expect(service.get(key, sessionStorage)).toEqual(value);
            expect(sessionStorage.getItem).toHaveBeenCalledWith(key);
        });
        it('object', () => {
            const key = 'bob';
            const model = { name: 'bob', age: 20, skils: ['angular', 'react'] };
            const value = JSON.stringify(model);
            sessionStorage.getItem.and.returnValue(value);
            expect(service.get(key, sessionStorage)).toEqual(model);
            expect(sessionStorage.getItem).toHaveBeenCalledWith(key);
        });
        it('array', () => {
            const key = 'bob';
            const model = { name: 'bob', age: 20, skils: ['angular', 'react'] };
            const list = ['bob', 123, model];
            const value = JSON.stringify(list);
            sessionStorage.getItem.and.returnValue(value);
            expect(service.get(key, sessionStorage)).toEqual(list);
            expect(sessionStorage.getItem).toHaveBeenCalledWith(key);
        });
    });
    describe('set', () => {
        it('set string value', () => {
            const key = 'bob';
            const value = 'bob';
            service.set(key, value, sessionStorage);
            expect(sessionStorage.setItem).toHaveBeenCalledWith(key, value);
        });
        it('set not string value', () => {
            const key = 'bob';
            const value = { title: 'bob' };
            service.set(key, value, sessionStorage);
            expect(sessionStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
        });
    });
});
