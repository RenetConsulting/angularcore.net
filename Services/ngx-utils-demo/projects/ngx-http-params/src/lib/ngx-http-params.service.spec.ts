import { TestBed } from '@angular/core/testing';
import { NgxHttpParamsService } from './ngx-http-params.service';

describe('NgxHttpParamsService', () => {

    let service: NgxHttpParamsService;

    beforeEach(() => {
        service = TestBed.inject(NgxHttpParamsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    describe('string case', () => {
        it('string length > 0', () => {
            const x = { param1: 'val1' };
            expect(service.map(x).toString()).toEqual('param1=val1');
        });
        it('string length === 0', () => {
            const x = { param1: '' };
            expect(service.map(x).toString()).toEqual('param1=');
        });
    });
    it('number case', () => {
        const x = { param1: 'val1', param2: 2, };
        expect(service.map(x).toString()).toEqual('param1=val1&param2=2');
    });
    it('boolean case', () => {
        const x = { param1: 'val1', param2: 2, param3: true, param4: false };
        expect(service.map(x).toString()).toEqual('param1=val1&param2=2&param3=true&param4=false');
    });
    it('array case', () => {
        const x = {
            param1: 'val1',
            param2: 2,
            numbers: [1, 2, 3, 4],
            fruits: ['apple', 'pear', 'peach'],
            vegetables: ['tomato', 'potato', 'cucumber'],
        };
        // tslint:disable-next-line
        expect(service.map(x).toString()).toEqual('param1=val1&param2=2&numbers=1&numbers=2&numbers=3&numbers=4&fruits=apple&fruits=pear&fruits=peach&vegetables=tomato&vegetables=potato&vegetables=cucumber');
    });
    describe('object case', () => {
        it('with data', () => {
            const x = {
                param1: 'val1',
                param2: 2,
                numbers: [1, 2, 3, 4],
                fruits: ['apple', 'pear', 'peach'],
                vegetables: { tomato: 1, potato: 0.5, cucumber: 4 },
            };
            // tslint:disable-next-line
            expect(service.map(x).toString()).toEqual('param1=val1&param2=2&numbers=1&numbers=2&numbers=3&numbers=4&fruits=apple&fruits=pear&fruits=peach&vegetables.tomato=1&vegetables.potato=0.5&vegetables.cucumber=4');
        });
        it('with data and no prefix', () => {
            const x = {
                param1: 'val1',
                param2: 2,
                numbers: [1, 2, 3, 4],
                fruits: ['apple', 'pear', 'peach'],
                vegetables: { tomato: 1, potato: 0.5, cucumber: 4 },
            };
            // tslint:disable-next-line
            expect(service.map(x, '', false).toString()).toEqual('param1=val1&param2=2&numbers=1&numbers=2&numbers=3&numbers=4&fruits=apple&fruits=pear&fruits=peach&tomato=1&potato=0.5&cucumber=4');
        });
        it('with null', () => {
            const x = {
                param1: 'val1',
                param2: 2,
                numbers: [1, 2, 3, 4],
                fruits: null,
                vegetables: { tomato: 1, potato: 0.5, cucumber: 4 },
            };
            // tslint:disable-next-line
            expect(service.map(x).toString()).toEqual('param1=val1&param2=2&numbers=1&numbers=2&numbers=3&numbers=4&vegetables.tomato=1&vegetables.potato=0.5&vegetables.cucumber=4');
        });
    });
    it('case with undefined', () => {
        const x = {
            param1: 'val1',
            param2: 2,
            numbers: [1, 2, 3, 4],
            fruits: undefined,
            vegetables: { tomato: 1, potato: 0.5, cucumber: 4 },
        };
        // tslint:disable-next-line
        expect(service.map(x).toString()).toEqual('param1=val1&param2=2&numbers=1&numbers=2&numbers=3&numbers=4&vegetables.tomato=1&vegetables.potato=0.5&vegetables.cucumber=4');
    });
    it('case with null', () => {
        expect(service.map(null).toString()).toEqual('');
    });
    it('case with undefined', () => {
        expect(service.map(undefined).toString()).toEqual('');
    });
});
