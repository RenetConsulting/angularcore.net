import { EventEmitter } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { NgxValidatorDirective } from './ngx-validator.directive';

describe('NgxValidatorDirective', () => {

    let directive: NgxValidatorDirective;

    let ngControl: NgControl;
    let statusChanges: jasmine.SpyObj<Observable<any>>;

    beforeEach(() => {
        statusChanges = jasmine.createSpyObj<Observable<any>>('Observable', ['subscribe']);
        ngControl = { statusChanges: statusChanges as any } as NgControl;
        directive = new NgxValidatorDirective(ngControl);
    });

    it('title', () => {
        expect(directive.title).toEqual('Field');
    });
    it('validate instanceof EventEmitter', () => {
        expect(directive.validate instanceof EventEmitter).toEqual(true);
    });
    it('subscription instanceof Subscription', () => {
        expect(directive.subscription instanceof Subscription).toEqual(true);
    });
    it('ngOnChanges', () => {
        spyOn(directive, 'emitError');
        spyOn(directive, 'setTitle');
        directive.ngOnChanges();
        expect(directive.emitError).toHaveBeenCalled();
        expect(directive.setTitle).toHaveBeenCalled();
    });
    it('ngOnInit', () => {
        spyOn(directive.subscription, 'add');
        directive.ngOnInit();
        expect(directive.subscription.add).toHaveBeenCalled();
        // tslint:disable-next-line: deprecation
        expect(statusChanges.subscribe).toHaveBeenCalledWith(directive.emitError);
    });
    it('ngOnDestroy', () => {
        directive.ngOnDestroy();
        expect(directive.subscription.closed).toEqual(true);
    });
    it('blur', () => {
        spyOn(directive, 'emitError');
        directive.blur();
        expect(directive.emitError).toHaveBeenCalled();
    });

    describe('error', () => {

        it('required', () => {
            Object.defineProperty(ngControl, 'errors', { get: () => ({ required: true }) });
            expect(directive.getError()).toEqual(`The ${directive.title} is required.`);
        });
        it('email', () => {
            Object.defineProperty(ngControl, 'errors', { get: () => ({ email: true }) });
            expect(directive.getError()).toEqual(`The ${directive.title} is invalid.`);
        });
        it('minlength', () => {
            const requiredLength = 5;
            Object.defineProperty(ngControl, 'errors', { get: () => ({ minlength: { requiredLength } }) });
            expect(directive.getError())
                .toEqual(`The length of the ${directive.title} must be at least ${requiredLength} characters long.`);
        });
        it('maxlength', () => {
            const requiredLength = 5;
            Object.defineProperty(ngControl, 'errors', { get: () => ({ maxlength: { requiredLength } }) });
            expect(directive.getError()).toEqual(`The length of the ${directive.title} must be at most ${requiredLength} characters long.`);
        });
        it('errorMessage', () => {
            const errorMessage = 'Hello Bob';
            Object.defineProperty(ngControl, 'errors', { get: () => ({ errorMessage }) });
            expect(directive.getError()).toEqual(errorMessage);
        });
        it('null', () => {
            Object.defineProperty(ngControl, 'errors', { get: () => null });
            expect(directive.getError()).toEqual(null);
        });
        it('not specified error', () => {
            Object.defineProperty(ngControl, 'errors', { get: () => ({ notSpecifiedError: true }) });
            expect(directive.getError()).toEqual(null);
        });
    });

    describe('emitError', () => {

        it('it has to call', () => {
            spyOn(directive.validate, 'emit');
            const error = 'Hello Bob';
            spyOn(directive, 'getError').and.returnValue(error);
            Object.defineProperty(ngControl, 'enabled', { get: () => true });
            Object.defineProperty(ngControl, 'touched', { get: () => true });
            directive.emitError();
            expect(directive.validate.emit).toHaveBeenCalledWith(error);
        });
        it('it has not to call', () => {
            spyOn(directive.validate, 'emit');
            const error = 'Hello Bob';
            spyOn(directive, 'getError').and.returnValue(error);
            Object.defineProperty(ngControl, 'enabled', { get: () => true });
            Object.defineProperty(ngControl, 'touched', { get: () => false });
            directive.emitError();
            expect(directive.validate.emit).not.toHaveBeenCalled();
        });
    });

    describe('setTitle', () => {

        it('label', () => {
            const value = 'bob';
            directive.label = value;
            directive.setTitle();
            expect(directive.title).toEqual(value);
        });
        it('placeholder', () => {
            const value = 'bob';
            directive.placeholder = value;
            directive.setTitle();
            expect(directive.title).toEqual(value);
        });
        it('title', () => {
            directive.setTitle();
            expect(directive.title).toEqual(directive.title);
        });
    });
});
