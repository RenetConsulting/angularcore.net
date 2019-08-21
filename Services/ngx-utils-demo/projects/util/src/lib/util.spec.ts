import { isBoolean, isFunction, isNumber, isNumbers, isObject, isString } from './util';

describe('Util', () => {

    describe('isBoolean', () => {

        it('check if NaN is not a bool', () => {
            expect(isBoolean(NaN)).toEqual(false);
        });
        it('check if null is not a bool', () => {
            expect(isBoolean(null)).toEqual(false);
        });
        it('check if 123 is bool', () => {
            expect(isBoolean(123)).toEqual(false);
        });
        it('check if 0 is bool', () => {
            expect(isBoolean(0)).toEqual(false);
        });
        it('check if string is not a bool', () => {
            expect(isBoolean('Bob')).toEqual(false);
        });
        it('check if object is not a bool', () => {
            expect(isBoolean({})).toEqual(false);
        });
        it('check if array is not a bool', () => {
            expect(isBoolean([])).toEqual(false);
        });
        it('check if function is not a bool', () => {
            // tslint:disable-next-line:only-arrow-functions
            expect(isBoolean(function() { })).toEqual(false);
        });
        it('check if bool is a bool', () => {
            expect(isBoolean(true)).toEqual(true);
        });
        it('check if bool is a bool', () => {
            expect(isBoolean(false)).toEqual(true);
        });
    });

    describe('isFunction', () => {

        it('check if NaN is not a function', () => {
            expect(isFunction(NaN)).toEqual(false);
        });
        it('check if null is not a function', () => {
            expect(isFunction(null)).toEqual(false);
        });
        it('check if 123 is function', () => {
            expect(isFunction(123)).toEqual(false);
        });
        it('check if 0 is function', () => {
            expect(isFunction(0)).toEqual(false);
        });
        it('check if string is not a function', () => {
            expect(isFunction('Bob')).toEqual(false);
        });
        it('check if object is not a function', () => {
            expect(isFunction({})).toEqual(false);
        });
        it('check if array is not a function', () => {
            expect(isFunction([])).toEqual(false);
        });
        it('check if bool is a not function', () => {
            expect(isFunction(true)).toEqual(false);
        });
        it('check if function is a function', () => {
            // tslint:disable-next-line:only-arrow-functions
            expect(isFunction(function() { })).toEqual(true);
        });
        it('check if function is a function', () => {
            expect(isFunction(() => { })).toEqual(true);
        });
    });

    describe('isNumber', () => {

        it('check if NaN is a number', () => {
            expect(isNumber(NaN)).toEqual(false);
        });
        it('check if null is not a number', () => {
            expect(isNumber(null)).toEqual(false);
        });
        it('check if 123 is number', () => {
            expect(isNumber(14)).toEqual(true);
        });
        it('check if string is not a number', () => {
            expect(isNumber('Bob')).toEqual(false);
        });
        it('check if bool is not a number', () => {
            expect(isNumber(true)).toEqual(false);
        });
    });

    describe('isNumbers', () => {

        it('check if empty is not a number', () => {
            expect(isNumbers()).toEqual(false);
        });
        it('check if NaN is not a number', () => {
            expect(isNumbers(1, NaN)).toEqual(false);
        });
        it('check if null is not a number', () => {
            expect(isNumbers(0, null)).toEqual(false);
        });
        it('check if 123 is number', () => {
            expect(isNumbers(123)).toEqual(true);
        });
        it('check if string is not a number', () => {
            expect(isNumbers(1, 'Bob')).toEqual(false);
        });
        it('check if bool is not a number', () => {
            expect(isNumbers(1, true)).toEqual(false);
        });
    });

    describe('isObject', () => {

        it('check if NaN is not a object', () => {
            expect(isObject(NaN)).toEqual(false);
        });
        it('check if null is not a object', () => {
            expect(isObject(null)).toEqual(false);
        });
        it('check if 123 is object', () => {
            expect(isObject(123)).toEqual(false);
        });
        it('check if 0 is object', () => {
            expect(isObject(0)).toEqual(false);
        });
        it('check if string is not a object', () => {
            expect(isObject('Bob')).toEqual(false);
        });
        it('check if array is not a object', () => {
            expect(isObject([])).toEqual(true);
        });
        it('check if function is a object', () => {
            // tslint:disable-next-line:only-arrow-functions
            expect(isObject(function() { })).toEqual(true);
        });
        it('check if bool is not a object', () => {
            expect(isObject(true)).toEqual(false);
        });
        it('check if object is a object', () => {
            expect(isObject({})).toEqual(true);
        });
    });

    describe('isString', () => {

        it('check if NaN is not a string', () => {
            expect(isString(NaN)).toEqual(false);
        });
        it('check if null is not a string', () => {
            expect(isString(null)).toEqual(false);
        });
        it('check if 123 is string', () => {
            expect(isString(123)).toEqual(false);
        });
        it('check if 0 is string', () => {
            expect(isString(0)).toEqual(false);
        });
        it('check if object is not a string', () => {
            expect(isString({})).toEqual(false);
        });
        it('check if array is not a string', () => {
            expect(isString([])).toEqual(false);
        });
        it('check if function is not a string', () => {
            // tslint:disable-next-line:only-arrow-functions
            expect(isString(function() { })).toEqual(false);
        });
        it('check if string is a string', () => {
            expect(isString('')).toEqual(true);
        });
        it('check if string is a string', () => {
            expect(isString('')).toEqual(true);
        });
        it('check if string is a string', () => {
            expect(isString(``)).toEqual(true);
        });
    });
});
