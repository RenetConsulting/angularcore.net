import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { ResetPasswordRequest } from './actions';
import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {

    let component: ResetPasswordComponent;

    let store: MockStore<null>;
    let route: ActivatedRoute;
    const token = 'bob';

    beforeEach(() => {
        route = { queryParams: of({ token } as Params) } as ActivatedRoute;
        TestBed.configureTestingModule({
            providers: [provideMockStore({})]
        });
        store = TestBed.inject(Store as any);
        component = new ResetPasswordComponent(store, route);
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
    it('ngOnInit', () => {
        spyOn(component, 'setFormGroup');
        spyOn(component, 'setToken');
        component.ngOnInit();
        expect(component.setFormGroup).toHaveBeenCalled();
        expect(component.setToken).toHaveBeenCalled();
    });
    it('ngOnDestroy', () => {
        component.ngOnDestroy();
        expect(component.subscription.closed).toEqual(true);
    });
    it('setFormGroup', () => {
        component.setFormGroup();
        expect(component.formGroup instanceof FormGroup).toEqual(true);
    });
    it('setToken', () => {
        const tokenControl = jasmine.createSpyObj<AbstractControl>('AbstractControl', ['patchValue']);
        component.formGroup = {
            controls: { token: tokenControl } as { [k: string]: AbstractControl }
        } as FormGroup;
        component.setToken(token);
        expect(component.formGroup.controls.token.patchValue).toHaveBeenCalledWith(token);
    });
    it('submit', () => {
        spyOn(store, 'dispatch');
        component.formGroup = { valid: true } as FormGroup;
        component.submit();
        expect(store.dispatch).toHaveBeenCalledWith(new ResetPasswordRequest(component.formGroup));
    });
});