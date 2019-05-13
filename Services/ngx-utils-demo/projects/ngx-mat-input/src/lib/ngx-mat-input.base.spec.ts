import { EventEmitter } from '@angular/core';
import { AbstractControl, FormGroupDirective, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxMatInputBase } from './ngx-mat-input.base';

class TestBase extends NgxMatInputBase { }

describe('NgxMatInputBase', () => {

    let base: TestBase;

    let ngControl: NgControl;
    let formGroup: FormGroupDirective;
    let control: jasmine.SpyObj<AbstractControl>;

    beforeEach(() => {
        control = jasmine.createSpyObj<AbstractControl>('AbstractControl', [
            'markAsDirty',
            'markAsTouched',
            'updateValueAndValidity',
            'validator'
        ]);
        ngControl = { control: control as AbstractControl } as NgControl;
        formGroup = {} as FormGroupDirective;
        base = new TestBase(ngControl, formGroup);
    });

    it('base instanceof NgxMatInputBase', () => {
        expect(base instanceof NgxMatInputBase).toEqual(true);
    });
    it('subscription instanceof Subscription', () => {
        expect(base.subscription instanceof Subscription).toEqual(true);
    });
    it('ngControl.valueAccessor', () => {
        expect(base.ngControl.valueAccessor).toEqual(base);
    });
    it('ngOnChanges', () => {
        spyOn(base, 'setErrorsState');
        spyOn(base, 'setHintState');
        spyOn(base, 'setRequired');
        spyOn(base, 'setMaxlength');
        base.ngOnChanges({ errors: {} });
        expect(base.setErrorsState).toHaveBeenCalled();
        expect(base.setHintState).toHaveBeenCalled();
        expect(base.setRequired).toHaveBeenCalled();
        expect(base.setMaxlength).toHaveBeenCalled();
    });
    it('ngOnInit', () => {
        spyOn(base, 'updateControl');
        spyOn(base, 'setError');
        formGroup.ngSubmit = new EventEmitter<any>();
        base.ngOnInit();
        formGroup.ngSubmit.emit(null);
        expect(base.updateControl).toHaveBeenCalled();
        expect(base.setError).toHaveBeenCalledWith(null);
        base.ngOnDestroy();
    });
    it('ngOnDestroy', () => {
        base.ngOnDestroy();
        expect(base.subscription.closed).toEqual(true);
    });
    it('showHint', () => {
        expect(base.showHint).toEqual(true);
    });
    it('showHint errors.length === 0', () => {
        base.errors = [];
        expect(base.showHint).toEqual(true);
    });
    it('writeValue', () => {
        const value = '123';
        base.onChange = jasmine.createSpy();
        base.writeValue(value);
        expect(base.value).toEqual(value);
        expect(base.onChange).toHaveBeenCalledWith(value);
    });
    it('registerOnChange', () => {
        const fn = () => { };
        base.registerOnChange(fn);
        expect(base.onChange).toEqual(fn);
    });
    it('registerOnTouched', () => {
        const fn = () => { };
        base.registerOnTouched(fn);
        expect(base.onTouched).toEqual(fn);
    });
    it('setDisabledState', () => {
        const value = true;
        base.setDisabledState(value);
        expect(base.disabled).toEqual(value);
    });
    describe('setErrorState', () => {
        it('should be 0', () => {
            base.setErrorState();
            expect(base.errorState).toEqual(0);
        });
        it('should be 1', () => {
            base.error = 'Bob error';
            base.setErrorState();
            expect(base.errorState).toEqual(1);
        });
    });
    describe('setHintState', () => {
        it('should be 0', () => {
            Object.defineProperty(base, 'showHint', { get: () => false });
            base.setHintState();
            expect(base.hintState).toEqual(0);
        });
        it('should be 1', () => {
            base.setHintState();
            expect(base.hintState).toEqual(1);
        });
    });
    describe('setErrorsState', () => {
        it('should be 0', () => {
            base.setErrorsState();
            expect(base.errorsState).toEqual(0);
        });
        it('should be 3', () => {
            base.errors = ['error 1', 'error 2', 'error 3'];
            base.setErrorsState();
            expect(base.errorsState).toEqual(base.errors.length);
        });
    });
    it('updateControl', () => {
        base.updateControl();
        expect(base.ngControl.control.markAsDirty).toHaveBeenCalled();
        expect(base.ngControl.control.markAsTouched).toHaveBeenCalled();
        expect(base.ngControl.control.updateValueAndValidity).toHaveBeenCalled();
    });
    describe('setRequired', () => {
        it('should set required', () => {
            control.validator.and.returnValue({ required: true });
            base.setRequired();
            expect(base.required).toEqual(true);
        });
        it('should not set required', () => {
            control = jasmine.createSpyObj<AbstractControl>('AbstractControl', [
                'markAsDirty',
                'markAsTouched',
                'updateValueAndValidity',
            ]);
            ngControl = { control: control as AbstractControl } as NgControl;
            base = new TestBase(ngControl, formGroup);
            base.setRequired();
            expect(base.required).toBeUndefined();
        });
    });
    describe('setMaxlength', () => {
        it('should set maxlength', () => {
            const requiredLength = 26;
            control.validator.and.returnValue({ maxlength: { requiredLength } });
            base.setMaxlength();
            expect(base.maxlength).toEqual(requiredLength);
        });
        it('should not set maxlength', () => {
            control = jasmine.createSpyObj<AbstractControl>('AbstractControl', [
                'markAsDirty',
                'markAsTouched',
                'updateValueAndValidity',
            ]);
            ngControl = { control: control as AbstractControl } as NgControl;
            base = new TestBase(ngControl, formGroup);
            base.setMaxlength();
            expect(base.maxlength).toBeUndefined();
        });
    });
    it('setError', () => {
        spyOn(base, 'setErrorState');
        spyOn(base, 'setHintState');
        const error = 'Bob error';
        base.setError(error);
        expect(base.error).toEqual(error);
        expect(base.setErrorState).toHaveBeenCalled();
        expect(base.setHintState).toHaveBeenCalled();
    });
});
